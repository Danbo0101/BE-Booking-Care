'use strict';
module.exports = (sequelize, DataTypes) => {
  const Specialties = sequelize.define('Specialties', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  Specialties.associate = function (models) {
    Specialties.hasMany(models.DoctorUser, { foreignKey: 'specialtiesId', as: 'doctors' });
  };

  return Specialties;
};