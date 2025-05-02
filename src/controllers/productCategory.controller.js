import ProductCategoryService from "#services/productCategory";
import BaseController from "#controllers/base";

class ProductCategoryController extends BaseController {
  static Service = ProductCategoryService;
}

export default ProductCategoryController;
