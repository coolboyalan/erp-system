import Ledger from "#models/ledger";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Purchase from "#models/purchase";

class Payment extends BaseModel {
  static paymentTypeArr = ["Purchase", "Sale Return"];
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
});
console.log(true);
export default Payment;
