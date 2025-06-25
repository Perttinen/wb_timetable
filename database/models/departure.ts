import { Model, DataTypes } from "sequelize";

import db from "../../backend/util/db";

const { sequelize } = db;

class Departure extends Model {}

Departure.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lineId: {
      type: DataTypes.INTEGER,
      references: { model: "lines", key: "id" },
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "departure",
  }
);

export default Departure;
