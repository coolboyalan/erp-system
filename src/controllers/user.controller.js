import httpStatus from "http-status";
import UserService from "#services/user";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import { session } from "#middlewares/requestSession";
import RoleService from "#services/role";

class UserController extends BaseController {
  static Service = UserService;

  static async login(req, res, next) {
    const loginData = await this.Service.login(req.body);
    sendResponse(httpStatus.OK, res, loginData, "Logged in successfully");
  }

  static async changePassword(req, res, next) {
    const data = await this.Service.changePassword(req.params.id, req.body);
    sendResponse(httpStatus.OK, res, data, "Password changed successfully");
  }

  static async getLoggedIn(req, res, next) {
    const userId = session.get("userId");
    let loggedInUser = await this.Service.getDocById(userId);
    const role = await RoleService.get(loggedInUser.roleId);
    loggedInUser = loggedInUser.toJSON();

    loggedInUser.permissions = role.permissions;
    sendResponse(httpStatus.OK, res, loggedInUser);
  }
}

export default UserController;
