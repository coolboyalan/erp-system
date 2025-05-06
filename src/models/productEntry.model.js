import Bin from "#models/bin";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Product from "#models/product";
import Purchase from "#models/purchase";

class ProductEntry extends BaseModel {}

ProductEntry.initialize(
  {
    barCode: {
      type: DataTypes.STRING,
      allowNull: false,
      //WARN: Unique constraint missing
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
    purchaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: Purchase,
        key: Purchase.primaryKeyAttribute,
      },
      allowNull: false,
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
    ],
  },
);

export default ProductEntry;
