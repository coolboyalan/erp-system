import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class Admin extends BaseModel {}

Admin.initialize(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //WARN: Unique constraint missing
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      async beforeCreate(instance) {
        instance.password = await hash(instance.password);
      },
    },
  },
);

export default Admin;
