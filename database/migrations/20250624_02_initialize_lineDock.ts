import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable("line_docks", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dock_id: {
        type: DataTypes.INTEGER,
        references: { model: "docks", key: "id" },
        allowNull: false,
      },
      line_id: {
        type: DataTypes.INTEGER,
        references: { model: "lines", key: "id" },
        allowNull: false,
      },
      delay_from_start: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable("line_docks");
  },
};
