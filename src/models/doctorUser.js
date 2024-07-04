'use strict';
module.exports = (sequelize, DataTypes) => {
  const DoctorUser = sequelize.define('DoctorUser', {
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false,
    },
    clinicId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Clinic',
        key: 'id'
      },
      allowNull: false,
    },
    specialtiesId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Specialties',
        key: 'id'
      },
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  DoctorUser.associate = function (models) {
    DoctorUser.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor' });
    DoctorUser.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinic' });
    DoctorUser.belongsTo(models.Specialties, { foreignKey: 'specialtiesId', as: 'specialties' });
    DoctorUser.hasOne(models.Schedule, { foreignKey: 'doctorUserId', as: 'schedule' });
  };

  return DoctorUser;
};
