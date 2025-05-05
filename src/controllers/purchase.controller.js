import PurchaseService from "#services/purchase";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import httpStatus from "http-status";

class PurchaseController extends BaseController {
  static Service = PurchaseService;

  static async getBaseField(req, res, next) {
    const data = await this.Service.getBaseFields();
    sendResponse(httpStatus.OK, res, data);
  }
}

export default PurchaseController;
