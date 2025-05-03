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
}

export default UserService;
