import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Warehouse from "#models/warehouse";

class Purchase extends BaseModel {}

Purchase.initialize({
  warehouseId: {
    type: DataTypes.INTEGER,
    references: {
      model: Warehouse,
      key: Warehouse.primaryKeyAttribute,
    },
    allowNull: false,
  },
});

export default Purchase;
