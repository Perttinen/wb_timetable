import { DataTypes } from "@sequelize/core"
import type { Migration } from "../db"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("lines", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    end_dock_id: {
      type: DataTypes.INTEGER,
      references: {
        table: "docks",
        key: "id",
      } as unknown as never,
      allowNull: false,
    },
    start_dock_id: {
      type: DataTypes.INTEGER,

      references: {
        table: "docks",
        key: "id",
      } as unknown as never,
      allowNull: false,
    },
  })
}
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("lines")
}
