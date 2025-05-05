import Bin from "#models/bin";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Product from "#models/product";

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
      refernces: {
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
    },
  },
  {
    indexes: [
      {
        fields: ["binId"],
      },
    ],
  },
);

export default ProductEntry;
