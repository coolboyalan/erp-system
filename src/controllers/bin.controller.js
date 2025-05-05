import httpStatus from "http-status";
import BinService from "#services/bin";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";

class BinController extends BaseController {
  static Service = BinService;

  static async create(req, res, next) {
    const bin = await this.Service.create(req.body);
    sendResponse(
      httpStatus.OK,
      res,
      bin,
      `Bin ${bin.name} has been created successfully`,
    );
  }
}

export default BinController;
