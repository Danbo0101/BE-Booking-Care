'use strict';
module.exports = (sequelize, DataTypes) => {
  const DoctorInfo = sequelize.define('DoctorInfo', {
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false,
      primaryKey: true,
    },
    province: DataTypes.STRING,
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {});

  DoctorInfo.associate = function (models) {
    DoctorInfo.belongsTo(models.User, { foreignKey: 'doctorId' });
  };

  return DoctorInfo;
};
