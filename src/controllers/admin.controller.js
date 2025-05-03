import AdminService from "#services/admin";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";

class AdminController extends BaseController {
  static Service = AdminService;

  static async login(req, res, next) {
    const loginData = await this.Service.login(req.body);
    sendResponse(httpStatus.OK, res, loginData, "Logged in successfully");
  }
}

export default AdminController;
