import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";

import db from "../db";

const { sequelize } = db;

class Dock extends Model<InferAttributes<Dock>, InferCreationAttributes<Dock>> {
  declare id: CreationOptional<number>;
  declare name: string;
}

Dock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "dock",
  }
);

export default Dock;
