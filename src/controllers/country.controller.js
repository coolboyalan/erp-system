import CountryService from "#services/country";
import BaseController from "#controllers/base";

class CountryController extends BaseController {
  static Service = CountryService;
}

export default CountryController;
