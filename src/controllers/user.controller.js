import httpStatus from "http-status";
import UserService from "#services/user";
import BaseController from "#controllers/base";

class UserController extends BaseController {
  static Service = UserService;

  static async login(req, res, next) {
    const loginData = await this.Service.login(req.body);
    sendResponse(httpStatus.OK, res, loginData, "Logged in successfully");
  }
}

export default UserController;
