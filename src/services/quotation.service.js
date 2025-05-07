import BaseService from "#services/base";
import LeadService from "#services/lead";
import Quotation from "#models/quotation";
import LedgerService from "#services/ledger";

class QuotationService extends BaseService {
  static Model = Quotation;

  static async create(data) {
    data.userId = 1;
    return await super.create(data);
  }

  static async getBaseFields() {
    const ledgerData = LedgerService.get(
      null,
      { pagination: "false" },
      { fields: ["id", "companyName as name", "email"] },
    );
    const leadData = LeadService.get(
      null,
      { pagination: "false" },
      { fields: ["id", "name", "email"] },
    );

    const [ledgers, leads] = await Promise.all([ledgerData, leadData]);

    return {
      ledgers,
      leads,
    };
  }
}

export default QuotationService;
