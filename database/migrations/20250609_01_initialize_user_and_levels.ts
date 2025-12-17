import { DataTypes } from "@sequelize/core"
// import { User, Userlevel } from "../models"

import type { Migration } from "../db"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("user_and_level", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userlevelId: {
      type: DataTypes.INTEGER,
      references: {
        table: "userlevels",
        key: "id",
      } as unknown as never,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        table: "users",
        key: "id",
      } as unknown as never,
      allowNull: false,
    },
  })
}
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("user_and_level")
}
