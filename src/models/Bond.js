import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Bond = sequelize.define(
  "Bond",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    bondId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "friendId"],
      },
    ],
  }
);
