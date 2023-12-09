import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Event } from "./Event.js";
import { PurchasedTicket } from "./PurchasedTicket.js";

export const Receipt = sequelize.define("Receipt", {
  receiptId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "userId",
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: "eventId",
    },
  },
  purchasedTickets: {
    type: DataTypes.JSON, // IDS DE LOS TICKETS COMPRADOS
  },
  status: {
    type: DataTypes.STRING, // STATUS DE LA COMPRA
    defaultValue: "pendiente",
  },
  totalAmount: {
    type: DataTypes.INTEGER, //TOTAL ENTRADAS
  },
  receipts: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});
