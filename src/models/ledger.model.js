import User from "#models/user";
import City from "#models/city";
import State from "#models/state";
import BaseModel from "#models/base";
import Country from "#models/country";
import { DataTypes } from "sequelize";

class Ledger extends BaseModel {
  static ledgerTypeEnumArr = ["Customer", "Supplier", "Both"];
}

Ledger.initialize({
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ledgerType: {
    type: DataTypes.ENUM(Ledger.ledgerTypeEnumArr),
    allowNull: false,
  },
  assignedSalesPerson: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
  },
  phone: {
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  alternatePhone: {
    type: DataTypes.INTEGER,
  },
  additionalEmail: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  gstNumber: {
    type: DataTypes.STRING,
  },
  panNumber: {
    type: DataTypes.STRING,
  },
  creditDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  creditLimit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },

  streetAddress: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.INTEGER,
    references: {
      model: Country,
      key: Country.primaryKeyAttribute,
    },
  },
  state: {
    type: DataTypes.INTEGER,
    references: {
      model: State,
      key: State.primaryKeyAttribute,
    },
  },
  city: {
    type: DataTypes.INTEGER,
    references: {
      model: City,
      key: City.primaryKeyAttribute,
    },
  },
  pinCode: {
    type: DataTypes.INTEGER,
  },
  landmark: {
    type: DataTypes.STRING,
  },

  // Bank Details
  accountNumber: {
    type: DataTypes.STRING,
  },
  bankName: {
    type: DataTypes.STRING,
  },
  branchAddress: {
    type: DataTypes.STRING,
  },
  ifscCode: {
    type: DataTypes.STRING,
  },
});

export default Ledger;
