import CityService from "#services/city";
import BaseController from "#controllers/base";

class CityController extends BaseController {
  static Service = CityService;
}

export default CityController;
