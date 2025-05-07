import httpStatus from "http-status";
import LedgerService from "#services/ledger";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";

class LedgerController extends BaseController {
  static Service = LedgerService;

  static async get(req, res, next) {
    const { id } = req.params;
    const filters = req.query;
    const options = {};
    if (!id) {
      const fields = [
        "id",
        "ledgerType",
        "contactName",
        "email",
        "phone",
        "companyName",
        "userData.name AS assignedPersonName",
        "createdAt",
      ];

      const lookups = [
        {
          from: "Users",
          as: "userData",
          localField: "assignedPerson",
          foreignField: "id",
        },
      ];

      options.fields = fields;
      options.lookups = lookups;

      const data = await this.Service.get(null, filters, options);
      return sendResponse(
        httpStatus.OK,
        res,
        data,
        `${this.Service.Model.updatedName()} fetched successfully`,
      );
    }
    const data = await this.Service.get(id);
    sendResponse(
      httpStatus.OK,
      res,
      data,
      `${this.Service.Model.updatedName()} fetched successfully`,
    );
  }
}

export default LedgerController;
