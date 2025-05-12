import Lead from "#models/lead";
import BaseService from "#services/base";
import { session } from "#middlewares/requestSession";

class LeadService extends BaseService {
  static Model = Lead;

  static async create(data) {
    data.assignedPerson = session.get("userId");
    return await super.create(data);
  }
}

export default LeadService;
