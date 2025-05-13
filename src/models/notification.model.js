import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import User from "#models/user";

class Notification extends BaseModel {}

Notification.initialize({
  notification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
  readByUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  readByAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
});

export default Notification;
