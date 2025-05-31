'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('i18n', [
      {
        key: 'welcome',
        translations: JSON.stringify({ tr: 'Hoşgeldiniz', en: 'Welcome' }),
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('i18n', null, {});
  }
}; 