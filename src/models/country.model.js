import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class Country extends BaseModel {}

Country.initialize({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Country;
