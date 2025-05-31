'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        firstName: 'Yusuf',
        lastName: 'Albayrak',
        email: 'yusuf@albayrak.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // bcrypt ile hashlenmiş "123456" şifresi
        role: 'admin',
        companyId: '11111111-1111-1111-1111-111111111111',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}; 