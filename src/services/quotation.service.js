import Quotation from "#models/quotation";
import BaseService from "#services/base";

class QuotationService extends BaseService {
  static Model = Quotation;
}

export default QuotationService;
