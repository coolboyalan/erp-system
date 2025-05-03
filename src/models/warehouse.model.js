import City from "#models/city";
import State from "#models/state";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";
import Country from "#models/country";

class Warehouse extends BaseModel {}

Warehouse.initialize({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    //WARN: Unique constraint missing
  },
  street: {
    type: DataTypes.TEXT,
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
});

export default Warehouse;
