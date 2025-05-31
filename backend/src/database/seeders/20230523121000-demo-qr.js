'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('qrs', [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        menuId: '66666666-6666-6666-6666-666666666666',
        qrUrl: 'https://easymenu.com/demo-restaurant',
        pdfUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('qrs', null, {});
  }
}; 