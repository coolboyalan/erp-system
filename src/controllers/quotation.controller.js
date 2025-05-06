import QuotationService from "#services/quotation";
import BaseController from "#controllers/base";

class QuotationController extends BaseController {
  static Service = QuotationService;
}

export default QuotationController;
