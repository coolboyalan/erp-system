import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Purchase from "#models/purchase";

class PurchaseReturn extends BaseModel {}

PurchaseReturn.initialize({
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Purchase,
      key: Purchase.primaryKeyAttribute,
    },
  },
  products: {
    type: DataTypes.JSON,
  },
  totalQuantity: {
    type: DataTypes.DECIMAL(10, 2),
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
  returnDate: {
    type: DataTypes.DATE,
  },
});

export default PurchaseReturn;
