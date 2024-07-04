'use strict';
module.exports = (sequelize, DataTypes) => {
  const Clinic = sequelize.define('Clinic', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  Clinic.associate = function (models) {
    Clinic.hasMany(models.DoctorUser, { foreignKey: 'clinicId', as: 'doctors' });
  };

  return Clinic;
};
