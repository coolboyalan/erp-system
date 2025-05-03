import Ledger from "#models/ledger";
import BaseService from "#services/base";

class LedgerService extends BaseService {
  static Model = Ledger;
}

export default LedgerService;
