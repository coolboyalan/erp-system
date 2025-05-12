import Ledger from "#models/ledger";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Invoice from "#models/invoice";

class Receiving extends BaseModel {
  static receivingTypeArr = ["Sale", "Purchase Return"];

  static receivingMethodArr = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Cheque",
    "Bank Transfer",
  ];
}

Receiving.initialize({
  type: {
    type: DataTypes.ENUM(Receiving.receivingTypeArr),
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
  invoiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Invoice,
      key: Invoice.primaryKeyAttribute,
    },
  },
  purchaseReturnId: {
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
  receivingMethod: {
    type: DataTypes.ENUM(Receiving.receivingMethodArr),
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
  },
  receivingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  document: {
    type: DataTypes.TEXT,
  },
});

export default Receiving;
