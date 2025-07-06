import { DataTypes } from "@sequelize/core";
import type { Migration } from "../../backend/util/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("docks", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("docks");
};
