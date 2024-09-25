import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Event } from "./Event.js";

export const PurchasedTicket = sequelize.define("PurchasedTicket", {
  ticketId: {
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
  ticketIdEntry: {
    type: DataTypes.INTEGER,
  },
  assigned: {
    type: DataTypes.BOOLEAN,
  },
  owner: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "userId",
    },  },
  status: {
    type: DataTypes.JSON, //ESTE STATUS ADENTRO LLEVA HORA Y SI FUE LEÍDO
  },
  code: {
    type: DataTypes.STRING,
  },
});
