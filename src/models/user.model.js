import { hash } from "bcryptjs";
import Role from "#models/role";
import City from "#models/city";
import State from "#models/state";
import BaseModel from "#models/base";
import Country from "#models/country";
import { DataTypes } from "sequelize";

class User extends BaseModel {}

User.initialize(
  {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternatePhone: {
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
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: Role.primaryKeyAttribute,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    hooks: {
      async beforeCreate(instance) {
        instance.password = await hash(instance.password, 10);
      },
    },
  },
);

export default User;
