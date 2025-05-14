import ProductCategory from "#models/productCategory";
import { session } from "#middlewares/requestSession";
import BaseService from "#services/base";

class ProductCategoryService extends BaseService {
  static Model = ProductCategory;

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);

    await doc.destroy({ force: true, transaction: session.get("transaction") });
  }
}

export default ProductCategoryService;
