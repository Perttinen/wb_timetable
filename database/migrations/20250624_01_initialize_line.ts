import { DataTypes } from "@sequelize/core";
import { Dock } from "../models";
import type { Migration } from "../../backend/util/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("lines", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    end_dock_id: {
      type: DataTypes.INTEGER,
      references: { model: Dock, key: "id" },
      allowNull: false,
    },
    start_dock_id: {
      type: DataTypes.INTEGER,
      references: { model: Dock, key: "id" },
      allowNull: false,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("lines");
};
