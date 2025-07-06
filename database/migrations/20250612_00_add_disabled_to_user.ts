import { DataTypes } from "@sequelize/core";
import type { Migration } from "../db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "disabled", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "disabled");
};
