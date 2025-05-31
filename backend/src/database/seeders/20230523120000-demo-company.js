'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('companies', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Demo Company',
        slug: 'demo-company',
        logo: null,
        primaryColor: '#FF5733',
        secondaryColor: '#333333',
        description: 'Demo şirket açıklaması',
        email: 'info@demo.com',
        phone: '555-111-1111',
        address: 'Demo Cad. No:1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('companies', null, {});
  }
}; 