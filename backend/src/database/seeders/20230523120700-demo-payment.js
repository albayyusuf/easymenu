'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('payments', [
      {
        id: '88888888-8888-8888-8888-888888888888',
        companyId: '11111111-1111-1111-1111-111111111111',
        plan: 'basic',
        amount: 199,
        currency: 'TRY',
        status: 'paid',
        stripeSessionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payments', null, {});
  }
}; 