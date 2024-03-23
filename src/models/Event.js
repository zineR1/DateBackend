import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";

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
    type: DataTypes.STRING,
  },
  startTime: {
    type: DataTypes.STRING,
  },
  endTime: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pendiente"
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
    // type: DataTypes.ARRAY(DataTypes.INTEGER),
    // references: {
    //   model: User,
    //   key: "userId",
    // },
  },
  bankDetails: {
    type: DataTypes.JSON,
  },
  mercadoPagoToken: {
    type: DataTypes.JSON,
  },
});
