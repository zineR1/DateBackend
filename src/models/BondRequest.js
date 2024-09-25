import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

export const BondRequest = sequelize.define('BondRequest', {
  requestId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // 'pending', 'accepted', 'rejected'
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Si quieres hacer que sea obligatorio que una solicitud esté asociada a un evento
    references: {
      model: 'Events',  // Nombre de la tabla de eventos
      key: 'eventId',
    },
  },
}, {
  timestamps: true,
});
