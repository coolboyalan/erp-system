import BaseModel from "#models/base";
import Country from "#models/country";
import { DataTypes } from "sequelize";

class State extends BaseModel {}

State.initialize(
  {
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
  },
  {
    indexes: [
      {
        name: "stateAndCountryIndex",
        unique: true,
        fields: ["name", "countryId"],
      },
    ],
  },
);

export default State;
