import { Op } from "sequelize";
import Ledger from "#models/ledger";
import Quotation from "#models/quotation";

class DashboardService {
  static async get(filters) {
    let { startDate, endDate } = filters || {};

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : sevenDaysAgo;
    const end = endDate ? new Date(endDate) : today;

    if (isNaN(start) || isNaN(end)) {
      throw new Error("Invalid date format.");
    }

    const diffInMs = end.getTime() - start.getTime();
    const previousStart = new Date(start.getTime() - diffInMs);
    const previousEnd = new Date(start.getTime());

    const [
      currentDealsCount,
      previousDealsCount,
      currentApprovedCount,
      previousApprovedCount,
      currentRevenue,
      previousRevenue,
      currentLedgerCount,
      previousLedgerCount,
    ] = await Promise.all([
      Quotation.count({
        where: {
          quotationDate: {
            [Op.between]: [start, end],
          },
        },
      }),
      Quotation.count({
        where: {
          quotationDate: {
            [Op.between]: [previousStart, previousEnd],
          },
        },
      }),
      Quotation.count({
        where: {
          status: "Approved",
          quotationDate: {
            [Op.between]: [start, end],
          },
        },
      }),
      Quotation.count({
        where: {
          status: "Approved",
          quotationDate: {
            [Op.between]: [previousStart, previousEnd],
          },
        },
      }),
      Quotation.sum("netAmount", {
        where: {
          quotationDate: {
            [Op.between]: [start, end],
          },
        },
      }),
      Quotation.sum("netAmount", {
        where: {
          quotationDate: {
            [Op.between]: [previousStart, previousEnd],
          },
        },
      }),
      Ledger.count({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      }),
      Ledger.count({
        where: {
          createdAt: {
            [Op.between]: [previousStart, previousEnd],
          },
        },
      }),
    ]);

    return {
      currentPeriod: {
        deals: currentDealsCount,
        Approved: currentApprovedCount,
        revenue: currentRevenue || 0,
        ledgers: currentLedgerCount,
      },
      previousPeriod: {
        deals: previousDealsCount,
        Approved: previousApprovedCount,
        revenue: previousRevenue || 0,
        ledgers: previousLedgerCount,
      },
    };
  }
}

export default DashboardService;
