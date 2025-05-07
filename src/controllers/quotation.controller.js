import httpStatus from "http-status";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";
import QuotationService from "#services/quotation";

class QuotationController extends BaseController {
  static Service = QuotationService;

  static async get(req, res, next) {
    const { id } = req.params;
    const filters = req.query;

    if (id) {
      const data = await this.Service.get(id);

      return sendResponse(
        httpStatus.OK,
        res,
        data,
        `${this.Service.Model.updatedName()} fetched successfully`,
      );
    }

    const fields = [
      "id",
      "ledgerData.companyName AS ledgerName",
      "leadData.name as leadName",
      "userData.name as userName",
      "quotationDate",
      "status",
      "netAmount",
    ];

    const lookups = [
      {
        from: "Ledgers",
        as: "ledgerData",
        localField: "ledgerId",
        foreignField: "id",
      },
      {
        from: "Leads",
        as: "leadData",
        localField: "leadId",
        foreignField: "id",
      },
      {
        from: "Users",
        as: "userData",
        localField: "userId",
        foreignField: "id",
      },
    ];

    const options = {};
    options.fields = fields;
    options.lookups = lookups;

    const data = await this.Service.get(null, filters, options);
    sendResponse(httpStatus.OK, res, data);
  }

  static async getBaseFields(req, res, next) {
    const data = await this.Service.getBaseFields();
    sendResponse(httpStatus.OK, res, data);
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const data = await this.Service.update(id, req.body);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      `${this.Service.Model.updatedName()} updated successfully`,
    );
  }

  static async updateStatus(req, res, next) {
    const { id } = req.params;
    const data = await this.Service.updateStatus(id, req.body);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      `${this.Service.Model.updatedName()} status updated successfully`,
    );
  }
}

export default QuotationController;
