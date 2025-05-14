import httpStatus from "http-status";
import { sendResponse } from "#utils/response";
import BaseController from "#controllers/base";
import ProductEntryService from "#services/productEntry";

class ProductEntryController extends BaseController {
  static Service = ProductEntryService;

  static async getPackingList(req, res, next) {
    const data = await this.Service.getPackingList(req.query);
    sendResponse(httpStatus.OK, res, data);
  }

  static async getWithBarCode(req, res, next) {
    const data = await this.Service.getWithBarCode(req.query);
    sendResponse(httpStatus.OK, res, data);
  }

  static async getHistory(req, res, next) {
    const data = await this.Service.getHistory(req.query);
    sendResponse(httpStatus.OK, res, data);
  }
}

export default ProductEntryController;
