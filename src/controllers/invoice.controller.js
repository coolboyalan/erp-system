import InvoiceService from "#services/invoice";
import BaseController from "#controllers/base";
import PackingService from "#services/packing";
import httpStatus from "http-status";
import { sendResponse } from "#utils/response";
import { Op } from "sequelize";

class InvoiceController extends BaseController {
  static Service = InvoiceService;

  static async getBaseFields(req, res, next) {
    const options = {
      fields: ["id", "ledgerData.companyName AS customerName", "id AS name"],
      lookups: [
        {
          from: "Quotations",
          as: "quotationData",
          localField: "quotationId",
          foreignField: "id",
        },
        {
          from: "Ledgers",
          as: "ledgerData",
          localField: "ledgerId",
          foreignField: "id",
          via: "quotationData",
        },
      ],
    };

    const packings = await PackingService.get(
      null,
      {
        packed: true,
        pagination: "false",
        invoiceId: null,
      },
      options,
    );

    sendResponse(httpStatus.OK, res, packings);
  }
}

export default InvoiceController;
