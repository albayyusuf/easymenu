'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('orders', [
      {
        id: '77777777-7777-7777-7777-777777777777',
        menuId: '66666666-6666-6666-6666-666666666666',
        tableNumber: '5',
        customerName: 'Ali Veli',
        customerPhone: '555-333-3333',
        status: 'pending',
        items: JSON.stringify([
          { productId: '44444444-4444-4444-4444-444444444444', qty: 2, price: 60, currency: 'TRY' }
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('orders', null, {});
  }
}; 