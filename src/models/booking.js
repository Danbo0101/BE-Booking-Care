'use strict';
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    scheduleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Schedule',
        key: 'id'
      },
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Status',
        key: 'id'
      },
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  Booking.associate = function (models) {
    Booking.belongsTo(models.Schedule, { foreignKey: 'scheduleId', as: 'schedule' });
    Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
    Booking.belongsTo(models.Status, { foreignKey: 'statusId', as: 'status' });
  };

  return Booking;
};
