import { DataTypes } from "@sequelize/core";
import type { Migration } from "../db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("userlevels", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userlevel: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("userlevels");
};
