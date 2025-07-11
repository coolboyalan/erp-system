import PaymentService from "#services/payment";
import BaseController from "#controllers/base";
import LedgerService from "#services/ledger";
import { sendResponse } from "#utils/response";
import httpStatus from "http-status";

class PaymentController extends BaseController {
  static Service = PaymentService;

  static async getBaseFields(req, res, next) {
    const fields = ["id", "companyName AS name", "email"];
    const data = await LedgerService.get(
      null,
      { pagination: "false" },
      { fields },
    );
    sendResponse(httpStatus.OK, res, { ledgers: data });
  }

  static async getTotal(req, res, next) {
    const { id } = req.params;
    const data = await this.Service.getLedgerPaymentSummary(id);
    sendResponse(httpStatus.OK, res, data);
  }

  static async get(req, res, next) {
    const { id } = req.params;
    const fields = [
      "id",
      "ledgerData.companyName AS customerName",
      "type",
      "amount",
      "paymentDate",
      "createdAt",
      "paymentMethod",
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

export default PaymentController;
