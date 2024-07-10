'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'DoctorUser',
        key: 'doctorId'
      },
      allowNull: false
    },
    timeTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TimeType',
        key: 'id'
      },
      allowNull: false
    },
    statusId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Status',
        key: 'id'
      },
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  Schedule.associate = function (models) {
    Schedule.belongsTo(models.DoctorUser, { foreignKey: 'doctorId', as: 'doctorUser' });
    Schedule.belongsTo(models.TimeType, { foreignKey: 'timeTypeId', as: 'timeType' });
    Schedule.belongsTo(models.Status, { foreignKey: 'statusId', as: 'status' });
    Schedule.hasMany(models.Booking, { foreignKey: 'scheduleId', as: 'bookings' });
  };

  return Schedule;
};
