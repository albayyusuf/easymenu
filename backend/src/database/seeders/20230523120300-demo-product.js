'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      {
        id: '44444444-4444-4444-4444-444444444444',
        companyId: '11111111-1111-1111-1111-111111111111',
        categoryId: '33333333-3333-3333-3333-333333333333',
        name: JSON.stringify({ tr: 'Mercimek Çorbası', en: 'Lentil Soup' }),
        description: JSON.stringify({ tr: 'Geleneksel çorba', en: 'Traditional soup' }),
        price: 60,
        currency: 'TRY',
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
}; 