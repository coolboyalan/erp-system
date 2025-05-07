import Lead from "#models/lead";
import BaseService from "#services/base";

class LeadService extends BaseService {
  static Model = Lead;
}

export default LeadService;
