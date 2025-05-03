import Purchase from "#models/purchase";
import BaseService from "#services/base";

class PurchaseService extends BaseService {
  static Model = Purchase;
}

export default PurchaseService;
