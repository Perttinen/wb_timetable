import { DataTypes } from "@sequelize/core"
import { Line } from "../models"
import type { Migration } from "../db"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("departures", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    line_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Line, key: "id" },
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  })
}
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("departures")
}
