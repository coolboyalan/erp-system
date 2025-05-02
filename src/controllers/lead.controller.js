import LeadService from "#services/lead";
import BaseController from "#controllers/base";

class LeadController extends BaseController {
  static Service = LeadService;
}

export default LeadController;
