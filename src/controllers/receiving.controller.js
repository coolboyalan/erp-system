import httpStatus from "http-status";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import ReceivingService from "#services/receiving";

class ReceivingController extends BaseController {
  static Service = ReceivingService;

  static async getTotal(req, res, next) {
    const { id } = req.params;
    const data = await this.Service.getLedgerReceivingSummary(id);
    sendResponse(httpStatus.OK, res, data);
  }

  static async get(req, res, next) {
    const { id } = req.params;
    const fields = [
      "id",
      "ledgerData.companyName AS customerName",
      "type",
      "amount",
      "receivingDate",
      "createdAt",
      "receivingMethod",
      "referenceNo",
    ];
    const lookups = [
      {
        from: "Ledgers",
        as: "ledgerData",
        localField: "ledgerId",
        foreignField: "id",
      },
    ];

    const options = { lookups, fields };

    const data = await this.Service.get(id, req.query, options);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      `${this.Service.Model.updatedName()} fetched successfully`,
    );
  }
}

export default ReceivingController;
