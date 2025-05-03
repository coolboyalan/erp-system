import WarehouseService from "#services/warehouse";
import BaseController from "#controllers/base";

class WarehouseController extends BaseController {
  static Service = WarehouseService;
}

export default WarehouseController;
