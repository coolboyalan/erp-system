import User from "#models/user";
import BaseService from "#services/base";
import randomPassword from "#utils/password";

class UserService extends BaseService {
  static Model = User;

  static async create(data) {
    const { password } = data;
    password = password ?? randomPassword(8);
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
