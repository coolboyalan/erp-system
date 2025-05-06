import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Warehouse from "#models/warehouse";

class TransferMaterial extends BaseModel {}

TransferMaterial.initialize({
  referenceNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Warehouse,
      key: Warehouse.primaryKeyAttribute,
    },
  },
  to: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Warehouse,
      key: Warehouse.primaryKeyAttribute,
    },
  },
  products: {
    type: DataTypes.JSON,
  },
  internal: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

export default TransferMaterial;
