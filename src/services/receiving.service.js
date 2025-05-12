import dayjs from "dayjs";
import BaseService from "#services/base";
import Receiving from "#models/receiving";
import { Op, fn, col, literal } from "sequelize";
import { session } from "#middlewares/requestSession";

class ReceivingService extends BaseService {
  static Model = Receiving;

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);
    await doc.destroy({ force: true, transaction: session.get("transaction") });
  }

  static async getLedgerReceivingSummary(ledgerId) {
    const now = dayjs();

    const todayStart = now.startOf("day").toDate();
    const weekStart = now.startOf("week").toDate();
    const monthStart = now.startOf("month").toDate();
    const yearStart = now.startOf("year").toDate();

    const buildQuery = (startDate = null) => ({
      attributes: [[fn("COALESCE", fn("SUM", col("amount")), 0), "total"]],
      where: {
        ledgerId,
        ...(startDate && {
          receivingDate: {
            [Op.gte]: startDate,
          },
        }),
      },
      raw: true,
    });

    const [total, today, week, month, year] = await Promise.all([
      Receiving.findOne(buildQuery()),
      Receiving.findOne(buildQuery(todayStart)),
      Receiving.findOne(buildQuery(weekStart)),
      Receiving.findOne(buildQuery(monthStart)),
      Receiving.findOne(buildQuery(yearStart)),
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

export default ReceivingService;
