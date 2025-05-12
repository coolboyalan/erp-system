import Invoice from "#models/invoice";
import BaseService from "#services/base";
import PackingService from "#services/packing";
import QuotationService from "#services/quotation";
import { session } from "#middlewares/requestSession";

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
}

export default InvoiceService;
