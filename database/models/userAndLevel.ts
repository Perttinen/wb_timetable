import { Model, DataTypes } from "sequelize";

import db from "../../backend/util/db";

const { sequelize } = db;

class UserAndlevel extends Model {}

UserAndlevel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userlevelId: {
      type: DataTypes.INTEGER,
      references: { model: "userlevels", key: "id" },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
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
