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

  static async getBaseFields(req, res, next) {
    const data = await this.Service.getBaseFields();
    sendResponse(httpStatus.OK, res, data);
  }

  static async get(req, res, next) {
    const { id } = req.params;
    const filters = req.query;
    const options = {
      lookups: [
        {
          from: "Quotations",
          as: "quotationData",
          localField: "quotationId",
          foreignField: "id",
        },
        {
          from: "Warehouses",
          as: "warehouseData",
          localField: "warehouseId",
          foreignField: "id",
        },
        {
          from: "Ledgers",
          as: "ledgerData",
        },
      ],
      fields: [
        "id",
        "packed",
        "quotationId",
        "packingDate",
        "createdAt",
        "warehouseData.name AS warehouseName",
      ],
    };

    const data = await this.Service.get(id, filters, options);
    sendResponse(httpStatus.OK, res, data);
  }
}

export default PackingController;
