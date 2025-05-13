import Ledger from "#models/ledger";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Purchase from "#models/purchase";
import User from "#models/user";

class Payment extends BaseModel {
  static paymentTypeArr = ["Purchase", "Sale Return"];

  static paymentMethodArr = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Cheque",
    "Bank Transfer",
  ];
}

Payment.initialize({
  type: {
    type: DataTypes.ENUM(Payment.paymentTypeArr),
    allowNull: false,
  },
  ledgerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ledger,
      key: Ledger.primaryKeyAttribute,
    },
  },
  purchaseId: {
    type: DataTypes.INTEGER,
    references: {
      model: Purchase,
      key: Purchase.primaryKeyAttribute,
    },
  },
  saleReturnId: {
    type: DataTypes.INTEGER,
  },
  referenceNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM(Payment.paymentMethodArr),
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  document: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
});

export default Payment;
