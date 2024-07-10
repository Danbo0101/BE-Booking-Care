'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Status', [{
      name: 'Còn lịch',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Hết lịch',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Đã đặt',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Đã hủy',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Status', null, {});
  }
};
