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
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
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
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
  },
  sentimentalSituation: {
    type: DataTypes.STRING,
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
    // type: DataTypes.ARRAY(DataTypes.INTEGER),
    type: DataTypes.JSON,
    defaultValue: [],
  },
});
