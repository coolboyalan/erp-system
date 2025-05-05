import Lead from "#models/lead";
import BaseService from "#services/base";

class LeadService extends BaseService {
  static Model = Lead;

  static async get(id, filters, options = {}) {
    if (!id) {
      const fields = [
        "id",
        "name",
        "phone",
        "email",
        "age",
        "companyName",
        "createdAt",
        "userData.name as assignedPersonName",
        "priorityLevel",
        "leadType",
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

export default LeadService;
