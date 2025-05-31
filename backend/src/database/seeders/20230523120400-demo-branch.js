'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('branches', [
      {
        id: '55555555-5555-5555-5555-555555555555',
        companyId: '11111111-1111-1111-1111-111111111111',
        name: 'Merkez Şube',
        address: 'Merkez Mah. No:1',
        phone: '555-222-2222',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('branches', null, {});
  }
}; 