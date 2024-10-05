import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define("User", {
  userId: {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  profilePictures: {
    type: DataTypes.JSON,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  dateOfBirth: {
    type: DataTypes.STRING,
  },
  genre: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  sentimentalSituation: {
    type: DataTypes.JSON,
  },
  phone: {
    type: DataTypes.STRING,
  },
  instagramToken: {
    type: DataTypes.STRING,
  },
  ownedTickets: {
    type: DataTypes.JSON, // COPIA DE LOS TICKETS QUE EL USER FUE OWNER
  },
  events: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  contactMethods: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
});
