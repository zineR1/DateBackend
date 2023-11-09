import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Comprobante = sequelize.define('comprobantes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    eventId: {
        type: DataTypes.INTEGER,
    },
    comprobantes: {
        type: DataTypes.JSON
    }
});