'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        id: '33333333-3333-3333-3333-333333333333',
        companyId: '11111111-1111-1111-1111-111111111111',
        name: JSON.stringify({ tr: 'Başlangıçlar', en: 'Starters' }),
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
}; 