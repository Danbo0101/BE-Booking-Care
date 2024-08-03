'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoices', {
      bookingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        allowNull: false,
      },
      bookingFee: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      consultationFee: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      feePaid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invoices');
  }
};
