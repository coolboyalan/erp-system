import StateService from "#services/state";
import BaseController from "#controllers/base";

class StateController extends BaseController {
  static Service = StateService;
}

export default StateController;
