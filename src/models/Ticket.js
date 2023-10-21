import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Ticket = sequelize.define('tickets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.INTEGER,
    },
    sold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    eventId: {
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER
    },
    cancelled: {
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: false // Desactivar timestamps
});