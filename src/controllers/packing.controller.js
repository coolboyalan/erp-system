import PackingService from "#services/packing";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import httpStatus from "http-status";

class PackingController extends BaseController {
  static Service = PackingService;

  static async getBarcodes(req, res, next) {
    const data = await this.Service.getBarCodes(req.query);
    sendResponse(httpStatus.OK, res, data);
  }
}

export default PackingController;
