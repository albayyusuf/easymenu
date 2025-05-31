'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('chatbot_logs', [
      {
        id: '99999999-9999-9999-9999-999999999999',
        companyId: '11111111-1111-1111-1111-111111111111',
        userId: '22222222-2222-2222-2222-222222222222',
        menuId: '66666666-6666-6666-6666-666666666666',
        request: JSON.stringify({ message: 'Menüde çorba var mı?' }),
        response: JSON.stringify({ answer: 'Evet, mercimek çorbası var.' }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('chatbot_logs', null, {});
  }
}; 