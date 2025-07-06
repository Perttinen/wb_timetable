import { DataTypes } from "@sequelize/core";
import { User, Userlevel } from "../models";
import type { Migration } from "../../backend/util/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("user_and_level", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userlevelId: {
      type: DataTypes.INTEGER,
      references: { model: Userlevel, key: "id" },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "id" },
      allowNull: false,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("user_and_level");
};
