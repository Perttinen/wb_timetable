import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import db from "../../backend/util/db";

import Dock from "./dock";

const { sequelize } = db;

class Line extends Model<InferAttributes<Line>, InferCreationAttributes<Line>> {
  declare id: CreationOptional<number>;
  declare startDockId: number;
  declare endDockId: number;
}

Line.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startDockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Dock, key: "id" },
    },
    endDockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Dock, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "line",
    underscored: true,
    timestamps: false,
  }
);

export default Line;
