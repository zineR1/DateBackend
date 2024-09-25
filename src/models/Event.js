import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Event = sequelize.define("Event", {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  flyer: {
    type: DataTypes.STRING,
  },
  eventName: {
    type: DataTypes.STRING,
  },
  eventDate: {
    type: DataTypes.DATE,
  },
  startTime: {
    type: DataTypes.TIME,
  },
  endTime: {
    type: DataTypes.TIME,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pendiente",
  },
  location: {
    type: DataTypes.STRING,
  },
  ticketType: {
    type: DataTypes.STRING, // Cambiar si hay un tipo específico de entradas
  },
  tickets: {
    type: DataTypes.JSON, // Guardar aquí los detalles de las entradas disponibles
  },
  organizers: {
    type: DataTypes.JSON,
  },
  bankDetails: {
    type: DataTypes.JSON,
  },
  mercadoPagoToken: {
    type: DataTypes.JSON,
  },
});
