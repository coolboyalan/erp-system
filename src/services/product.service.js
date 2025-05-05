import Product from "#models/product";
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
        "sku",
        "rate",
        "id",
        "createdAt",
      ];

      options.fields = fields;
      options.lookups = lookups;

      return await this.Model.find(filters, options);
    }
  }
}

export default ProductService;
