import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Event } from "./Event.js";

export const Guest = sequelize.define("Guest", {
  guestId: {
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
});