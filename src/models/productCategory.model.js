import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class ProductCategory extends BaseModel {}

ProductCategory.initialize({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    //WARN: Unique constraint missing
    set(value) {
      this.setDataValue("name", String(value).toUpperCase());
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  hsnCode: {
    type: DataTypes.STRING,
    allowNull: false,
    //WARN: Unique constraint missing
    set(value) {
      this.setDataValue("hsnCode", String(value).toUpperCase());
    },
  },
  gst: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
});

export default ProductCategory;
