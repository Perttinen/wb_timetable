import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";

import db from "../../backend/util/db";
import Userlevel from "./userlevel";
import User from "./user";

const { sequelize } = db;

class UserAndlevel extends Model<
  InferAttributes<UserAndlevel>,
  InferCreationAttributes<UserAndlevel>
> {
  declare id: CreationOptional<number>;
  declare userlevelId: number;
  declare userId: number;
}

UserAndlevel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userlevelId: {
      type: DataTypes.INTEGER,
      references: { model: Userlevel, key: "id" },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "id" },
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "userAndLevel",
  }
);

export default UserAndlevel;
