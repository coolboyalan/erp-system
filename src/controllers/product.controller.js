import ProductService from "#services/product";
import BaseController from "#controllers/base";

class ProductController extends BaseController {
  static Service = ProductService;
}

export default ProductController;
