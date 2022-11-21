'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
	up: (queryInterface, Sequelize) => {

		let data = [];
		let amount = 155;

		let id = 1;

		while(amount--) {
			let date = new Date();
			data.push({
				id: id++,
				name: faker.name.firstName(),
				gender: faker.name.gender(),
				created_at: date,
				updated_at: date,
			}
			);
		}
		return queryInterface.bulkInsert('user', data, {});
	},

	async down (queryInterface, Sequelize) {
		return queryInterface.bulkDelete('user', null, {});
	}
};
