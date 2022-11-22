'use strict';

function randomIntFromInterval(min, max) { 
	return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
	up: (queryInterface, Sequelize) => {

		let data = [];
		let people = 155;
		let id = 1000;

		for (let userId = 1; userId < people; userId++) {
			let friends = randomIntFromInterval(0, 150);

			while(friends--) {
				let date = new Date();
				data.push({
					id: id++,
					followingUserID: randomIntFromInterval(1, people),
					user_id: userId,
					created_at: date,
					updated_at: date,
				}
				);
			}

		} 

		return queryInterface.bulkInsert('subscription', data, {});
	},
	async down (queryInterface, Sequelize) {
		return  queryInterface.bulkDelete('subscription', null, {});
	}
};
