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
  startEventDate: {
    type: DataTypes.DATE,
  },
  endEventDate: {
    type: DataTypes.DATE,
  },
  startEventTime: {
    type: DataTypes.TIME,
  },
  endEventTime: {
    type: DataTypes.TIME,
  },
  startPreEventTime: {
    type: DataTypes.TIME,
  },
  preEventDate: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING,
  },
  eventStatus: {
    type: DataTypes.STRING,
    defaultValue: "pendiente",
  },
  preEventStatus: {
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
