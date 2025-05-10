import User from "#models/user";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Quotation from "#models/quotation";
import Warehouse from "#models/warehouse";
import Invoice from "#models/invoice";

class Packing extends BaseModel {}

Packing.initialize({
  quotationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quotation,
      key: Quotation.primaryKeyAttribute,
    },
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Invoice,
      key: Invoice.primaryKeyAttribute,
    },
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Warehouse,
      key: Warehouse.primaryKeyAttribute,
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
  packingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
  },
  products: {
    type: DataTypes.JSON,
  },
  packed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  priceData: {
    type: DataTypes.JSON,
  },
});

export default Packing;
