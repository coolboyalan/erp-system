import State from "#models/state";
import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class City extends BaseModel {}

City.initialize(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      //WARN: Unique constraint missing
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: State,
        key: State.primaryKeyAttribute,
      },
    },
  },
  {
    indexes: [
      {
        name: "cityAndStateIndex",
        unique: true,
        fields: ["name", "stateId"],
      },
    ],
  },
);

export default City;
