import User from "#models/user";
import Lead from "#models/lead";
import Ledger from "#models/ledger";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class Quotation extends BaseModel {
  static statusEnumArr = ["Approved", "Pending", "Cancelled"];
}

Quotation.initialize({
  ledgerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Ledger,
      key: Ledger.primaryKeyAttribute,
    },
  },
  leadId: {
    type: DataTypes.INTEGER,
    references: {
      model: Lead,
      key: Lead.primaryKeyAttribute,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
  quotationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.TEXT,
  },
  paymentTerms: {
    type: DataTypes.TEXT,
  },
  termsAndConditions: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  products: {
    type: DataTypes.JSON,
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  taxableAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gstAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(Quotation.statusEnumArr),
    allowNull: false,
    defaultValue: "Pending",
  },
  packed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default Quotation;
