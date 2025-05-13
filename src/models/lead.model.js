import User from "#models/user";
import City from "#models/city";
import State from "#models/state";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Country from "#models/country";

class Lead extends BaseModel {
  static genderEnumArr = ["Male", "Female", "Other"];

  static priorityEnumArr = ["Low", "Medium", "High"];

  static leadTypeArr = ["Company", "Individual","School"];
}

Lead.initialize({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  gender: {
    type: DataTypes.ENUM(Lead.genderEnumArr),
  },
  streetAddress: {
    type: DataTypes.STRING,
  },
  countryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Country,
      key: Country.primaryKeyAttribute,
    },
  },
  stateId: {
    type: DataTypes.INTEGER,
    references: {
      model: State,
      key: State.primaryKeyAttribute,
    },
  },
  cityId: {
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
  source: {
    type: DataTypes.STRING,
  },
  priorityLevel: {
    type: DataTypes.ENUM(Lead.priorityEnumArr),
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: User.primaryKeyAttribute,
    },
    allowNull: false,
  },
  leadType: {
    type: DataTypes.ENUM(Lead.leadTypeArr),
    allowNull: false,
  },
  followUp: {
    type: DataTypes.DATEONLY,
  },
  description: {
    type: DataTypes.TEXT,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  companyPhoneNo: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
});

export default Lead;
