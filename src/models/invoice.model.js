import User from "#models/user";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Ledger from "#models/ledger";

class Invoice extends BaseModel {}

Invoice.initialize({
  packingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
  ledgerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ledger,
      key: Ledger.primaryKeyAttribute,
    },
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  referenceNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shipTo: {
    type: DataTypes.TEXT,
  },
  installationCharges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  transportationCharges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  packagingCharges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  packagingTaxPercentage: {
    type: DataTypes.INTEGER,
    validate: { min: 0 },
  },
  vehicleName: {
    type: DataTypes.STRING,
  },
  driverName: {
    type: DataTypes.STRING,
  },
  driverPhone: {
    type: DataTypes.STRING,
  },
  remarks: {
    type: DataTypes.TEXT,
  },
  glOrLrNumber: {
    type: DataTypes.STRING,
  },

  // Financial summary fields with non-negative validation
  totalQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
  totalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
  taxableAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
  gstAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
  additionalCharges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: { min: 0 },
  },
});

export default Invoice;
