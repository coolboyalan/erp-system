import ProductCategory from "#models/productCategory";
import BaseService from "#services/base";

class ProductCategoryService extends BaseService {
  static Model = ProductCategory;
}

export default ProductCategoryService;
