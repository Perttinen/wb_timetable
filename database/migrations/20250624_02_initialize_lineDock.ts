import { DataTypes } from "@sequelize/core"
import type { Migration } from "../db"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("line_docks", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dock_id: {
      type: DataTypes.INTEGER,
      references: {
        table: "docks",
        key: "id",
      } as unknown as never,
      allowNull: false,
    },
    line_id: {
      type: DataTypes.INTEGER,
      references: {
        table: "lines",
        key: "id",
      } as unknown as never,
      allowNull: false,
    },
    delay_from_start: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
}
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("line_docks")
}
