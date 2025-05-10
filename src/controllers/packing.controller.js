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
          localField: "ledgerId",
          foreignField: "id",
          via: "quotationData",
        },
        {
          from: "Users",
          as: "userData",
          localField: "userId",
          foreignField: "id",
        },
      ],
      fields: [
        "id",
        "packed",
        "quotationId",
        "packingDate",
        "createdAt",
        "warehouseData.name AS warehouseName",
        "ledgerData.companyName AS customerName",
        "userData.name AS packedByName",
      ],
    };

    const data = await this.Service.get(id, filters, options);
    sendResponse(httpStatus.OK, res, data);
  }

  static async updateStatus(req, res, next) {
    const { id } = req.params;
    const data = await this.Service.updateStatus(id, req.body);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      "Packing status updated successfully",
    );
  }
}

export default PackingController;
