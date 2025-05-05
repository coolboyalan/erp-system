import httpStatus from "http-status";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import PurchaseService from "#services/purchase";

class PurchaseController extends BaseController {
  static Service = PurchaseService;

  static async getBaseField(req, res, next) {
    const data = await this.Service.getBaseFields();
    sendResponse(httpStatus.OK, res, data);
  }

  static async updateStatus(req, res, next) {
    const data = await this.Service.moveToWarehouse(req.params.id,req.body);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      "Purchase status updated successfully",
    );
  }
}

export default PurchaseController;
