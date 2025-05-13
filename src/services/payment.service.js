import dayjs from "dayjs";
import Payment from "#models/payment";
import BaseService from "#services/base";
import { Op, fn, col, literal } from "sequelize";
import { session } from "#middlewares/requestSession";

class PaymentService extends BaseService {
  static Model = Payment;

  static async create(data) {
    data.userId = session.get("userId");
    return await super.create(data);
  }

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);
    await doc.destroy({ force: true, transaction: session.get("transaction") });
  }

  static async getLedgerPaymentSummary(ledgerId) {
    const now = dayjs();

    const todayStart = now.startOf("day").toDate();
    const weekStart = now.startOf("week").toDate(); // Sunday
    const monthStart = now.startOf("month").toDate();
    const yearStart = now.startOf("year").toDate();

    const buildQuery = (startDate = null) => ({
      attributes: [[fn("COALESCE", fn("SUM", col("amount")), 0), "total"]],
      where: {
        ledgerId,
        ...(startDate && {
          paymentDate: {
            [Op.gte]: startDate,
          },
        }),
      },
      raw: true,
    });

    const [total, today, week, month, year] = await Promise.all([
      Payment.findOne(buildQuery()),
      Payment.findOne(buildQuery(todayStart)),
      Payment.findOne(buildQuery(weekStart)),
      Payment.findOne(buildQuery(monthStart)),
      Payment.findOne(buildQuery(yearStart)),
    ]);

    return {
      total: parseFloat(total.total),
      today: parseFloat(today.total),
      thisWeek: parseFloat(week.total),
      thisMonth: parseFloat(month.total),
      thisYear: parseFloat(year.total),
    };
  }
}

export default PaymentService;
