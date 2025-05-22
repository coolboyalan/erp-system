import httpStatus from "http-status";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import DashboardService from "#services/dashboard";

class DashboardController extends BaseController {
  static Service = DashboardService;

  static async get(req, res, next) {
    const data = await this.Service.get(req.query);
    sendResponse(httpStatus.OK, res, data);
  }
}

export default DashboardController;
