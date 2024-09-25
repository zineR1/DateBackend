import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Bond = sequelize.define(
  "Bond",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "userId",
      },
    },
    bondId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "userId",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "bondId"],
      },
    ],
  }
);
