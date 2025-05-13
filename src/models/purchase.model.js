import User from "#models/user";
import Ledger from "#models/ledger";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Warehouse from "#models/warehouse";

class Purchase extends BaseModel {
  static paymentTypeArr = ["Cash", "Cheque", "NEFT"];
}

Purchase.initialize(
  {
    warehouseId: {
      type: DataTypes.INTEGER,
      references: {
        model: Warehouse,
        key: Warehouse.primaryKeyAttribute,
      },
      allowNull: false,
    },
    ledgerId: {
      type: DataTypes.INTEGER,
      references: {
        model: Ledger,
        key: Ledger.primaryKeyAttribute,
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: User.primaryKeyAttribute,
      },
      allowNull: false,
    },
    purchaseNo: {
      type: DataTypes.STRING,
      allowNull: false,
      //WARN: Unique
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentMode: {
      type: DataTypes.ENUM(Purchase.paymentTypeArr),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    totalQuantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    taxableAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    gstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    netAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
    },
    purchaseReturnId: {
      type: DataTypes.INTEGER,
    },
    movedToWarehouse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    stockSettled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["purchaseNo"],
      },
      {
        fields: ["movedToWarehouse", "warehouseId"],
      },
    ],
    hooks: {
      async afterCreate(instance) {
        instance.purchaseNo = `PO-${instance.id}`;
        await instance.save();
      },
    },
  },
);

export default Purchase;
