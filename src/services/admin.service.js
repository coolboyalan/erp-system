import Admin from "#models/admin";
import { compare } from "bcryptjs";
import httpStatus from "http-status";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import { createToken } from "#utils/jwt";

class AdminService extends BaseService {
  static Model = Admin;

  static async login(data) {
    const { email, phone, password } = data;
    let admin = await this.Model.findDoc(email ? { email } : { phone });

    const verification = await compare(password, admin.password);

    if (!verification) {
      throw new AppError({
        status: false,
        message: "Incorrect password",
        httpStatus: httpStatus.UNAUTHORIZED,
      });
    }

    const payload = {
      adminId: admin.id,
      userType: "admin",
      email,
    };

    const token = createToken(payload);

    admin = admin.toJSON();

    delete admin.password;
    delete admin.createdAt;
    delete admin.updatedAt;

    return {
      token,
      data: admin,
    };
  }
}

export default AdminService;
