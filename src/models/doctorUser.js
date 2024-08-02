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
      primaryKey: true,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: DataTypes.DATE,
  }, {});

  DoctorUser.associate = function (models) {
    DoctorUser.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor' });
    DoctorUser.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinic' });
    DoctorUser.belongsTo(models.Specialties, { foreignKey: 'specialtiesId', as: 'specialties' });
    DoctorUser.hasOne(models.Schedule, { foreignKey: 'doctorId', as: 'schedule' });
    DoctorUser.hasMany(models.Attendance, { foreignKey: 'doctorId', as: 'attendances' });
  };

  return DoctorUser;
};
