import User from "#models/user";
import BaseService from "#services/base";
import randomPassword from "#utils/password";

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

    const payload = {
      userId: user.id,
      email,
    };

    const token = createToken(payload);

    user = user.toJSON();

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    return {
      token,
      data: user,
    };
  }
}

export default UserService;
