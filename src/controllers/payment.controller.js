import PaymentService from "#services/payment";
import BaseController from "#controllers/base";

class PaymentController extends BaseController {
  static Service = PaymentService;
}

export default PaymentController;
