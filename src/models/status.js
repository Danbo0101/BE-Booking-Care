'use strict';
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {});

  Status.associate = function (models) {
    Status.hasMany(models.Schedule, { foreignKey: 'statusId', as: 'schedules' });
    Status.hasMany(models.Booking, { foreignKey: 'statusId', as: 'bookings' });
  };

  return Status;
};
