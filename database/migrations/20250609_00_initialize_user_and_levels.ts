import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable("user_and_level", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userlevelId: {
        type: DataTypes.INTEGER,
        references: { model: "userlevels", key: "id" },
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
        allowNull: false,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable("user_and_level");
  },
};
