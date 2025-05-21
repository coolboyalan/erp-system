import httpStatus from "http-status";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import PurchaseReturnService from "#services/purchaseReturn";

class PurchaseReturnController extends BaseController {
  static Service = PurchaseReturnService;

  static async get(req, res, next) {
    const { id } = req.params;

    if (id) {
      return await super.get(req, res, next);
    }

    const fields = [
      "id",
      "purchaseId",
      "ledgerData.companyName AS vendorName",
      "totalQuantity",
      "netAmount",
      "returnDate",
    ];

    const lookups = [
      {
        from: "Purchases",
        as: "purchaseData",
        localField: "purchaseId",
        foreignField: "id",
      },
      {
        from: "Ledgers",
        as: "ledgerData",
        localField: "ledgerId",
        foreignField: "id",
        via: "purchaseData",
      },
    ];

    const options = { lookups, fields };

    const data = await this.Service.get(null, req.query, options);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      "Purchase return fetched successfully",
    );
  }

  static async getProductEntry(req, res, next) {
    const data = await this.Service.getProductEntry(req.query);
    sendResponse(httpStatus.OK, res, data);
  }
}

export default PurchaseReturnController;
