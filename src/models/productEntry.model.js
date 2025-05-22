import Bin from "#models/bin";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Packing from "#models/packing";
import Product from "#models/product";
import Purchase from "#models/purchase";
import Quotation from "#models/quotation";
import PurchaseReturn from "#models/purchaseReturn";

class ProductEntry extends BaseModel {}

ProductEntry.initialize(
  {
    barCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: Product.primaryKeyAttribute,
      },
    },
    binId: {
      type: DataTypes.INTEGER,
      references: {
        model: Bin,
        key: Bin.primaryKeyAttribute,
      },
      searchable: false,
    },
    packed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    markedForPacking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: Purchase,
        key: Purchase.primaryKeyAttribute,
      },
      allowNull: false,
    },
    packingId: {
      type: DataTypes.INTEGER,
      references: {
        model: Packing,
        key: Packing.primaryKeyAttribute,
      },
    },
    quotationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Quotation,
        key: Quotation.primaryKeyAttribute,
      },
    },
    history: {
      type: DataTypes.JSONB,
      defaultValue: "[]",
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    purchaseReturnId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: PurchaseReturn,
        key: PurchaseReturn.primaryKeyAttribute,
      },
    },
  },
  {
    indexes: [
      {
        fields: ["binId"],
      },
      {
        fields: ["productId"],
      },
      {
        fields: ["purchaseId"],
      },
      {
        fields: ["packed"],
      },
      {
        fields: ["productId", "packed"],
      },
      {
        fields: ["packingId"],
      },
    ],
  },
);

export default ProductEntry;
