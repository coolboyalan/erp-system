import User from "#models/user";
import { hash, compare } from "bcryptjs";
import bcrypt from "bcryptjs";
import BaseService from "#services/base";
import httpStatus from "http-status";
import randomPassword from "#utils/password";
import { createToken } from "#utils/jwt";
import AppError from "#utils/appError";
import RoleService from "#services/role";

class UserService extends BaseService {
  static Model = User;

  static async get(id, filters, options = {}) {
    if (!id) {
      const fields = [
        "name",
        "email",
        "phone",
        "id",
        "roleData.name AS roleName",
        "isActive",
        "createdAt",
      ];

      const lookups = [
        {
          from: "Roles",
          as: "roleData",
          localField: "roleId",
          foreignField: "id",
        },
      ];
      options.fields = fields;
      options.lookups = lookups;
      return await this.Model.find(filters, options);
    }

    return await this.Model.findDocById(id);
  }

  static async create(data) {
    const { password } = data;
    data.password = password ?? randomPassword(8);
    return await super.create(data);
  }

  static async update(id, data) {
    delete data.password;
    return super.update(id, data);
  }

  static async changePassword(id, data) {
    const { password } = data;
    data.password = await bcrypt.hash(password, 10);
    return await super.update(id, data);
  }

  static async login(data) {
    const { email, phone, password } = data;
    let user = await this.Model.findDoc(email ? { email } : { phone });

    const verification = await compare(password, user.password);

    if (!verification) {
      throw new AppError({
        status: false,
        message: "Incorrect password",
        httpStatus: httpStatus.UNAUTHORIZED,
      });
    }

    user = user.toJSON();

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    const role = await RoleService.get(user.roleId);

    user.permissions = role.permissions;
    user.roleName = role.name;

    const payload = {
      userId: user.id,
      email,
      role: role.name,
    };

    const token = createToken(payload);

    return {
      token,
      data: user,
    };
  }
}

export default UserService;
