import PurchaseService from "#services/purchase";
import BaseController from "#controllers/base";

class PurchaseController extends BaseController {
  static Service = PurchaseService;
}

export default PurchaseController;
