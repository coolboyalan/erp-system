import Warehouse from "#models/warehouse";
import BaseService from "#services/base";

class WarehouseService extends BaseService {
  static Model = Warehouse;
}

export default WarehouseService;
