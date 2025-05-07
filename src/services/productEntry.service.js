import ProductEntry from "#models/productEntry";
import httpStatus from "http-status";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import PurchaseService from "#services/purchase";
import BinService from "#services/bin";

class ProductEntryService extends BaseService {
  static Model = ProductEntry;

  static async create(productEntries) {
    const { data } = productEntries;

    if (!data.length) {
      throw new AppError({
        status: false,
        message: "Invalid data",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    const purchaseId = data[0]?.purchaseId;

    if (!purchaseId || !parseInt(purchaseId)) {
      throw new AppError({
        status: false,
        message: "Please provide a valid purchaseId",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    const purchase = await PurchaseService.getDocById(purchaseId);

    const counts = data.reduce((acc, ele) => {
      if (ele.purchaseId !== purchaseId) {
        throw new AppError({
          status: false,
          message: "Only one purchase is allowed per request",
          httpStatus: httpStatus.BAD_REQUEST,
        });
      }
      acc[ele.productId] = acc[ele.productId] + 1 || 1;
      return acc;
    }, {});

    const { products } = purchase;

    let count = 0;

    const updatedProducts = products.map((product) => {
      if (product.id in counts) {
        if (product.maxQuantity < counts[product.id]) {
          throw new AppError({
            status: false,
            message: `Invalid quantity for product with the code ${product.code}`,
            httpStatus: httpStatus.BAD_REQUEST,
          });
        }

        return {
          ...product,
          maxQuantity: product.maxQuantity - counts[product.id],
        };
      }
      return product;
    });

    updatedProducts.forEach((element) => {
      count += element.maxQuantity;
    });

    if (count === 0) {
      purchase.set("stockSettled", true); // ✅ Explicitly set the field
    }

    purchase.set("products", updatedProducts); // ✅ Explicitly set the field
    await purchase.save();
    await this.Model.bulkCreate(data);
  }

  static async getWithBarCode(data) {
    const { barCode, warehouseId } = data;

    const lookups = [
      {
        from: "Bins",
        as: "binData",
        localField: "binId",
        foreignField: "id",
      },
      {
        from: "Products",
        as: "productData",
        localField: "productId",
        foreignField: "id",
      },
    ];

    const fields = [
      "barCode",
      "id",
      "binId",
      "productData.name AS productName",
      "productData.code AS productCode",
      "productData.id AS productId",
      "binData.name AS binName",
      "binData.warehouseId AS warehouseId",
    ];

    const options = { fields, lookups };

    let entry = await this.get(
      null,
      {
        barCode,
        packed: false,
        markedForPacking: false,
        pagination: "false",
      },
      options,
    );

    if (!entry.length) {
      throw new AppError({
        status: false,
        message: "Product not found",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    entry = entry[0];

    if (entry.warehouseId !== Number(warehouseId)) {
      throw new AppError({
        status: false,
        message: "Product belongs to a different warehouse",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    return entry;
  }
}

export default ProductEntryService;
