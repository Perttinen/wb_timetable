import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import db from "../../backend/util/db";

import Line from "./line";

const { sequelize } = db;

class Departure extends Model<
  InferAttributes<Departure>,
  InferCreationAttributes<Departure>
> {
  declare id: CreationOptional<number>;
  declare lineId: number;
  declare start: Date;
}

Departure.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Line, key: "id" },
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "departure",
    underscored: true,
    timestamps: false,
  }
);

export default Departure;
