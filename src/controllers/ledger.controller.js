import LedgerService from "#services/ledger";
import BaseController from "#controllers/base";

class LedgerController extends BaseController {
  static Service = LedgerService;
}

export default LedgerController;
