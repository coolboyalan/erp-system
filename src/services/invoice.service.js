import dayjs from "dayjs";
import { Op, fn, col } from "sequelize";
import Invoice from "#models/invoice";
import BaseService from "#services/base";
import PackingService from "#services/packing";
import QuotationService from "#services/quotation";
import { session } from "#middlewares/requestSession";
import UserService from "#services/user";
import NotificationService from "#services/notification";

class InvoiceService extends BaseService {
  static Model = Invoice;

  static async create(data) {
    const { packingId } = data;
    data.userId = session.get("userId");
    const packing = await PackingService.getDoc({
      id: packingId,
      packed: true,
      invoiceId: null,
    });

    const quotation = await QuotationService.getDocById(packing.quotationId);
    data.ledgerId = quotation.ledgerId;

    const invoice = await super.create(data);

    packing.invoiceId = invoice.id;
    await packing.save();

    const user = await UserService.getDocById(data.userId);

    await NotificationService.create({
      notification: `Invoice no ${invoice.id} created by ${user.name}${user.email ? `-${user.email}` : ""}`,
      userId: data.userId,
      adminId: data.userId,
    });
  }

  static async deleteDoc(id) {
    const invoice = await this.Model.findDocById(id);
    const packing = await PackingService.getDocById(invoice.packingId);

    packing.invoiceId = null;
    await packing.save();
    await invoice.destroy({
      force: true,
      transaction: session.get("transaction"),
    });
  }

  static async getTotalOutstanding(ledgerId) {
    const result = await Invoice.findOne({
      attributes: [
        [fn("COALESCE", fn("SUM", col("netAmount")), 0), "totalOutstanding"],
      ],
      where: {
        ledgerId,
      },
      raw: true,
    });

    return {
      totalOutstanding: parseFloat(result.totalOutstanding),
    };
  }
}
InvoiceService.getTotalOutstanding(7).then((ele) => console.log(ele));
export default InvoiceService;
