import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { User } from './User.js';
import { Event } from './Event.js';

export const PurchasedTicket = sequelize.define('PurchasedTicket', {
    ticketId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        }
    },
    eventId: {
        type: DataTypes.INTEGER,
        references: {
            model: Event,
            key: 'eventId'
        }
    },
    ticketIdEntry: {
        type: DataTypes.INTEGER // Similar a 'idEntrada' en la estructura de entradas
    },
    assigned: {
        type: DataTypes.BOOLEAN // Similar a 'asignada' en la estructura de entradas
    },
    ticketName: {
        type: DataTypes.STRING // Similar a 'nombreEntrada' en la estructura de entradas
    },
    owner: {
        type: DataTypes.JSON // Similar a 'dueño' en la estructura de entradas
    },
    status: {
        type: DataTypes.JSON // Similar a 'estado' en la estructura de entradas
    },
    code: {
        type: DataTypes.STRING // Similar a 'codigo' en la estructura de entradas
    },
    // ... otros campos relevantes para un ticket comprado
});
