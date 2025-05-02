import Product from "#models/product";
import BaseService from "#services/base";

class ProductService extends BaseService {
  static Model = Product;
}

export default ProductService;
