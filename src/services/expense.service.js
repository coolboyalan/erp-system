import Expense from "#models/expense";
import BaseService from "#services/base";

class ExpenseService extends BaseService {
  static Model = Expense;
}

export default ExpenseService;
