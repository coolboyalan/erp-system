import Payment from "#models/payment";
import BaseService from "#services/base";

class PaymentService extends BaseService {
  static Model = Payment;
}

export default PaymentService;
