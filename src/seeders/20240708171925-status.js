'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Statuses', [{
      name: 'Còn lịch',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Hết lịch',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'Đã đặt',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Đã hủy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Bị hủy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Quá hạn',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Statuses', null, {});
  }
};
