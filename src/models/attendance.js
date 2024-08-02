'use strict';

module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        doctorId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'DoctorUser',
                key: 'doctorId'
            },
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        isPresent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        }
    }, {});

    Attendance.associate = function (models) {
        Attendance.belongsTo(models.DoctorUser, { foreignKey: 'doctorId', as: 'doctor' });
    };

    return Attendance;
};
