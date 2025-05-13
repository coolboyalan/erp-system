import InvoiceService from "#services/invoice";
import BaseController from "#controllers/base";
import PackingService from "#services/packing";
import httpStatus from "http-status";
import { sendResponse } from "#utils/response";

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

  static async getOutstanding(req, res, next) {
    const { id } = req.params;
    const data = await this.Service.getTotalOutstanding(id);
    sendResponse(httpStatus.OK, res, data, "Outstanding fetched successfully");
  }

  static async get(req, res, next) {
    const { id } = req.params;

    const options = {
      fields: [
        "id",
        "packingId",
        "referenceNo",
        "invoiceDate",
        "createdAt",
        "userData.name AS preparedBy",
        "ledgerData.companyName AS customerName",
      ],
      lookups: [
        {
          from: "Ledgers",
          as: "ledgerData",
          localField: "ledgerId",
          foreignField: "id",
        },
        {
          from: "Users",
          as: "userData",
          localField: "userId",
          foreignField: "id",
        },
      ],
    };

    const data = await this.Service.get(id, req.query, options);
    sendResponse(httpStatus.OK, res, data, "Invoices fetched successfully");
  }
}

export default InvoiceController;
