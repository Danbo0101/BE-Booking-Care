'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('TimeTypes', [{
      name: '8:00.am - 8:30.am',
      time: '08:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '8:30.am - 9:00.am',
      time: '08:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '9:00.am - 9:30.am',
      time: '09:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: '9:30.am - 10:00.am',
      time: '09:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '10:00.am - 10:30.am',
      time: '10:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '10:30.am - 11:00.am',
      time: '10:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: '11:00.am - 11:30.am',
      time: '11:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '11:30.am - 12:00.pm',
      time: '11:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '1:00.pm - 1:30.pm',
      time: '13:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: '1:30.pm - 2:00.pm',
      time: '13:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '2:00.pm - 2:30.pm',
      time: '14:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '2:30.pm - 3:00.pm',
      time: '14:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: '3:00.pm - 3:30.pm',
      time: '15:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '3:30.pm - 4:00.pm',
      time: '15:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '4:00.pm - 4:30.pm',
      time: '16:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: '4:30.pm - 5:00.pm',
      time: '16:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TimeTypes', null, {});
  }
};
