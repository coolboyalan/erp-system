import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import ProductCategory from "#models/productCategory";

class Product extends BaseModel {
  static typeEnumArr = ["Finished", "Semi-Finished"];
}

Product.initialize(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      // WARN: Unique constraint missing
    },
    type: {
      type: DataTypes.ENUM(Product.typeEnumArr),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      // WARN: Unique constraint missing
    },
    productCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCategory,
        key: ProductCategory.primaryKeyAttribute,
      },
    },
    baseQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      file: true,
    },
    averagePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    hooks: {
      async afterCreate(instance) {
        instance.averagePrice = instance.rate;
        await instance.save();
      },
    },
  },
);

export default Product;
