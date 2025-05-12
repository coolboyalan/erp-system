import User from "#models/user";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class Expense extends BaseModel {}

Expense.initialize({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  document: {
    type: DataTypes.TEXT,
  },
});

export default Expense;
