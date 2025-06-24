import { Model, DataTypes } from "sequelize";

import db from "../../backend/util/db";

const { sequelize } = db;

class Line extends Model {}

Line.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    endDockId: {
      type: DataTypes.INTEGER,
      references: { model: "docks", key: "id" },
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "line",
  }
);

export default Line;
