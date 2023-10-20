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
    userId: {
        type: DataTypes.INTEGER
    }

})