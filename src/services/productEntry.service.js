import ProductEntry from "#models/productEntry";
import BaseService from "#services/base";

class ProductEntryService extends BaseService {
  static Model = ProductEntry;
}

export default ProductEntryService;
