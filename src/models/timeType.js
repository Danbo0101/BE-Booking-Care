'use strict';
module.exports = (sequelize, DataTypes) => {
  const TimeType = sequelize.define('TimeType', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {});

  TimeType.associate = function (models) {
    TimeType.hasMany(models.Schedule, { foreignKey: 'timeTypeId', as: 'schedules' });
  };

  return TimeType;
};
