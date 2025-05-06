import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Quotation from "#models/quotation";
import Warehouse from "#models/warehouse";

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
});

export default Packing;
