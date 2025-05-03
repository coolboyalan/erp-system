import ProductEntryService from "#services/productEntry";
import BaseController from "#controllers/base";

class ProductEntryController extends BaseController {
  static Service = ProductEntryService;
}

export default ProductEntryController;
