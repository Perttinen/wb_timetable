import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";

import db from "../db";

const { sequelize } = db;

class Userlevel extends Model<
  InferAttributes<Userlevel>,
  InferCreationAttributes<Userlevel>
> {
  declare id: CreationOptional<number>;
  declare userlevel: string;
}

Userlevel.init(
  {
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "userlevel",
  }
);

export default Userlevel;
