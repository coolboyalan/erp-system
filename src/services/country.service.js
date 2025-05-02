import Country from "#models/country";
import BaseService from "#services/base";

class CountryService extends BaseService {
  static Model = Country;
}

export default CountryService;
