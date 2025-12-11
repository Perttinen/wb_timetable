import { DataTypes } from "@sequelize/core"
import type { Migration } from "../db"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
}
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("users")
}
