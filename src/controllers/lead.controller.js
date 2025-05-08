import LeadService from "#services/lead";
import BaseController from "#controllers/base";
import httpStatus from "http-status";
import { sendResponse } from "#utils/response";

class LeadController extends BaseController {
  static Service = LeadService;

  static async get(req, res, next) {
    const { id } = req.params;
    const filters = req.query;
    const options = {};

    if (!id) {
      const fields = [
        "id",
        "name",
        "phone",
        "email",
        "age",
        "companyName",
        "createdAt",
        "userData.name as assignedPersonName",
        "priorityLevel",
        "leadType",
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
    return sendResponse(
      httpStatus.OK,
      res,
      data,
      `${this.Service.Model.updatedName()} fetched successfully`,
    );
  }
}

export default LeadController;
