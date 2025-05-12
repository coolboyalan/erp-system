import httpStatus from "http-status";
import UserService from "#services/user";
import { sendResponse } from "#utils/response";
import ExpenseService from "#services/expense";
import BaseController from "#controllers/base";

class ExpenseController extends BaseController {
  static Service = ExpenseService;

  static async getBaseFields(req, res, next) {
    const data = await UserService.get(
      null,
      { pagination: "false" },
      {
        fields: ["id", "name", "email"],
      },
    );
    sendResponse(httpStatus.OK, res, data);
  }

  static async get(req, res, next) {
    const { id } = req.params;
    const fields = [
      "id",
      "userData.name AS name",
      "userData.email AS email",
      "amount",
      "date",
      "createdAt",
    ];
    const lookups = [
      {
        from: "Users",
        as: "userData",
        localField: "userId",
        foreignField: "id",
      },
    ];

    const data = await this.Service.get(id, req.query, { lookups, fields });
    sendResponse(
      httpStatus.OK,
      res,
      data,
      `${this.Service.Model.updatedName()} fetched successfully`,
    );
  }
}

export default ExpenseController;
