import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core"

import db from "../db"

import Dock from "./dock"
import Line from "./line"

const { sequelize } = db

class LineDock extends Model<
  InferAttributes<LineDock>,
  InferCreationAttributes<LineDock>
> {
  declare id: CreationOptional<number>
  declare dockId: number
  declare lineId: number
}

LineDock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dockId: {
      type: DataTypes.INTEGER,
      references: { model: Dock, key: "id" },
      allowNull: false,
    },
    lineId: {
      type: DataTypes.INTEGER,
      references: { model: Line, key: "id" },
      allowNull: false,
    },
    delayFromStart: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "lineDock",
  }
)

export default LineDock
