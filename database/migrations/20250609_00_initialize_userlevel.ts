import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable("userlevels", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userlevel: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable("userlevels");
  },
};
