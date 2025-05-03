import BinService from "#services/bin";
import BaseController from "#controllers/base";

class BinController extends BaseController {
  static Service = BinService;
}

export default BinController;
