import Role from "#models/role";
import City from "#models/city";
import State from "#models/state";
import BaseModel from "#models/base";
import Country from "#models/country";
import { DataTypes } from "sequelize";

class User extends BaseModel {}

User.initialize({
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alternateMobileNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    //WARN: Unique constraint missing
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
  },
  leavingDate: {
    type: DataTypes.DATEONLY,
  },
  userRole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: Role.primaryKeyAttribute,
    },
  },
  qualification: {
    type: DataTypes.STRING,
  },
  panNumber: {
    type: DataTypes.STRING,
  },
  aadharNumber: {
    type: DataTypes.STRING,
  },
  familyReferenceInfo: {
    type: DataTypes.TEXT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  basicSalary: {
    type: DataTypes.DECIMAL(10, 2),
  },
  homeRentalAllowance: {
    type: DataTypes.DECIMAL(10, 2),
  },
  conveyance: {
    type: DataTypes.DECIMAL(10, 2),
  },
  address1: {
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  landmark: {
    type: DataTypes.STRING,
  },
});

export default User;
