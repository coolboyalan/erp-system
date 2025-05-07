import PackingService from "#services/packing";
import BaseController from "#controllers/base";

class PackingController extends BaseController {
  static Service = PackingService;
}

export default PackingController;
