'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('menus', [
      {
        id: '66666666-6666-6666-6666-666666666666',
        companyId: '11111111-1111-1111-1111-111111111111',
        branchId: '55555555-5555-5555-5555-555555555555',
        slug: 'demo-restaurant',
        logoUrl: null,
        colorCode: '#FF5733',
        prompt: 'Hoşgeldiniz!',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('menus', null, {});
  }
}; 