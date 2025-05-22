import WarehouseService from "#services/warehouse";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";

class WarehouseController extends BaseController {
  static Service = WarehouseService;

  static async getTotal(req, res, next) {
    const { warehouseId } = req.query;
    const data = await this.Service.getTotalValue(warehouseId);
    sendResponse(httpStatus.OK, res, data);
  }
}

export default WarehouseController;
