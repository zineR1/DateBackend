import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Receipt } from './receiptModel.js'; // Asegúrate de importar correctamente el modelo de Receipt

export const Guest = sequelize.define('Guest', {
    guestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    userName: {
        type: DataTypes.STRING,
        unique: true,
    },
    profilePictures: {
        type: DataTypes.STRING,
    },
    receipts: {
        type: DataTypes.JSON,
        references: {
            model: Receipt,
            key: 'receiptId'
        }
    },
    status: {
        type: DataTypes.STRING, // STATUS DE LA COMPRA
    },
    totalAmount: {
        type: DataTypes.INTEGER, //TOTAL ENTRADAS
    },
});

// Guest.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });
