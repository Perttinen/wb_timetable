import { Model, DataTypes } from "sequelize";

import db from "../../backend/util/db";

const { sequelize } = db;

class Userlevel extends Model {}

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
