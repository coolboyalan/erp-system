import Ledger from "#models/ledger";
import BaseService from "#services/base";

class LedgerService extends BaseService {
  static Model = Ledger;

  static async get(id, filters, options = {}) {
    if (!id) {
      const fields = [
        "id",
        "ledgerType",
        "contactName",
        "email",
        "phone",
        "companyName",
        "userData.name AS assignedPersonName",
        "createdAt",
      ];

      const lookups = [
        {
          from: "Users",
          as: "userData",
          localField: "assignedPerson",
          foreignField: "id",
        },
      ];

      options.fields = fields;
      options.lookups = lookups;

      return await this.Model.find(filters, options);
    }
    return await this.Model.findDocById(id);
  }
}

export default LedgerService;
