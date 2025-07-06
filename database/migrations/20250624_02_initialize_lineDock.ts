import { DataTypes } from "@sequelize/core";
import { Line, Dock } from "../models";
import type { Migration } from "../../backend/util/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("line_docks", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dock_id: {
      type: DataTypes.INTEGER,
      references: { model: Dock, key: "id" },
      allowNull: false,
    },
    line_id: {
      type: DataTypes.INTEGER,
      references: { model: Line, key: "id" },
      allowNull: false,
    },
    delay_from_start: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("line_docks");
};
