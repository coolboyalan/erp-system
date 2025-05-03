import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Warehouse from "#models/warehouse";

class Bin extends BaseModel {}

Bin.initialize(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Warehouse,
        key: Warehouse.primaryKeyAttribute,
      },
    },
  },
  {
    indexes: [
      {
        name: "warehouseBinIndex",
        unique: true,
        fields: ["name", "warehouseId"],
      },
    ],
  },
);

export default Bin;
