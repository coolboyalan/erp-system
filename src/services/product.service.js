import Product from "#models/product";
import { session } from "#middlewares/requestSession";
import BaseService from "#services/base";

class ProductService extends BaseService {
  static Model = Product;

  static async get(id, filters, options = {}) {
    if (!id) {
      const lookups = [
        {
          from: "ProductCategories",
          as: "categoryData",
          localField: "productCategoryId",
          foreignField: "id",
        },
      ];

      const fields = [
        "name",
        "categoryData.name AS categoryName",
        "code",
        "rate",
        "id",
        "createdAt",
        "categoryData.gst AS gst",
      ];

      options.fields = fields;
      options.lookups = lookups;

      return await this.Model.find(filters, options);
    }

    return await this.Model.findDocById(id);
  }

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);
    await doc.destroy({ force: true, transaction: session.get("transaction") });
  }
}

export default ProductService;
