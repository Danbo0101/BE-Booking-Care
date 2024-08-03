'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
        bookingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Booking',
                key: 'id'
            },
            allowNull: false,
        },
        bookingFee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        consultationFee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        feePaid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});

    Invoice.associate = function (models) {
        Invoice.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
    };

    return Invoice;
};
