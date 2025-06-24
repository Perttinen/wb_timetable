import { Model, DataTypes } from "sequelize";

import db from "../../backend/util/db";

const { sequelize } = db;

class LineDock extends Model {}

LineDock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dockId: {
      type: DataTypes.INTEGER,
      references: { model: "userlevels", key: "id" },
      allowNull: false,
    },
    lineId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
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
);

export default LineDock;
