import BaseModel from "#models/base";
import Country from "#models/country";
import { DataTypes } from "sequelize";

class State extends BaseModel {}

State.initialize({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Country,
      key: Country.primaryKeyAttribute,
    },
  },
});

export default State;
