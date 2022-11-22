'use strict';

const express = require('express');
const cors = require('cors');
const process = require('process');

const app = express();

app.use(cors());

const { DataTypes, Op } = require('sequelize');

const { sequelize } = require('../models');

let port = process.env.PORT;

if (port == null || port == '') {
	port = 4000;
}

const SUBSCRIPTION = sequelize.define(
	'SUBSCRIPTION',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.UUIDV4,
		},
		followingUserID: {
			type: DataTypes.INTEGER,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'USER',
				key: 'id',
			},
		},
	},
	{
		tableName: 'subscription',
		createdAt: false,
		updatedAt: false,
	}
);

const USER = sequelize.define(
	'USER',
	{
		id: {
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: 'user',
		createdAt: false,
		updatedAt: false,
	}
);

USER.hasMany(SUBSCRIPTION, { foreignKey: 'user_id' });
SUBSCRIPTION.belongsTo(USER, { foreignKey: 'user_id' });

const getAll = async (direction) => {
	const obj = await USER.findAll({
		attributes: {
			include: [
				[sequelize.fn('COUNT', sequelize.col('user_id')), 'followingCount'],
			],
		},
		include: [
			{
				model: SUBSCRIPTION,
				attributes: [],
			},
		],
		group: ['USER.id'],
		order: [['followingCount', direction]],
	});

	return obj;
};

app.get('/users', express.json(), async (req, res) => {
	const usersWithFriends = await USER.findAll({ include: SUBSCRIPTION });

	res.send(usersWithFriends);
});

app.get('/:userId/friends', express.json(), async (req, res) => {
	const { userId } = req.params;

	const sortCol = req.query.order_by;
	const sortDir = req.query.order_type;

	const thisUser = await USER.findOne({
		where: {
			id: userId,
		}
	});

	if(!thisUser) {
		res.send(404);
	}

	const SubsOfUser = await SUBSCRIPTION.findAll ({
		where: {
			user_id: userId,
		},
	});

	const PeopleFollowedByUser = await SubsOfUser.map((friend) => friend.dataValues.followingUserID);

	const peopleWhoFollowUser = await USER.findAll({
		order: [
			[sortCol, sortDir]],  
		include: {
			model: SUBSCRIPTION,
			where: {
				followingUserID: {
					[Op.eq]: userId
				},
			}
		}
  
	});

	const mutualFriendship = peopleWhoFollowUser.filter((person) => PeopleFollowedByUser.includes(person.id));

	const finalUser = {
		'user': thisUser,
		'friendsCount': mutualFriendship.length,
		'friendsList': mutualFriendship,
	};

	res.send(finalUser);
});

app.get('/max-following', express.json(), async (req, res) => {
	const usersWithSubscriptions = await getAll('DESC');

	const topFiveUsersWithSubs = await usersWithSubscriptions.slice(0, 5);

	res.send(topFiveUsersWithSubs);
});

app.get('/not-following', express.json(), async (req, res) => {
	const usersWithSubscriptions = await getAll('ASC');

	const usersWithNoSubs = await usersWithSubscriptions.filter(
		(obj) => obj.dataValues.followingCount === '0'
	);

	res.send(usersWithNoSubs);
});

app.listen(port, () => {
	console.log('Me runnig');
});
