'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'id'
      },
      allowNull: false,
    },
    phone: DataTypes.STRING,
    image: DataTypes.STRING,
    isActive: DataTypes.TINYINT(1),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {});

  User.associate = function (models) {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
    User.hasOne(models.DoctorInfo, { foreignKey: 'doctorId' });
    User.hasOne(models.DoctorUser, { foreignKey: 'doctorId', as: 'doctorInfo' });
    User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'bookings' });
  };

  return User;
};
