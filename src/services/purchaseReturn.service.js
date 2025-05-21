import { Op } from "sequelize";
import httpStatus from "http-status";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import PurchaseReturn from "#models/purchaseReturn";
import { session } from "#middlewares/requestSession";
import ProductEntryService from "#services/productEntry";

class PurchaseReturnService extends BaseService {
  static Model = PurchaseReturn;

  static async create(data) {
    const { productData } = data;
    const purchaseReturn = await this.Model.create(data);
    await ProductEntryService.Model.update(
      { purchaseReturnId: purchaseReturn.id },
      {
        where: {
          id: {
            [Op.in]: productData,
          },
        },
        transaction: session.get("transaction"),
      },
    );
  }

  static async getProductEntry(filters) {
    const { purchaseId, barCode } = filters;

    const options = {
      fields: [
        "productData.name AS productName",
        "productId",
        "barCode",
        "id",
        "productData.code AS productCode",
        "binData.name AS binName",
        "warehouseData.name AS warehouseName",
        "purchaseReturnId",
      ],
      lookups: [
        {
          from: "Products",
          as: "productData",
          localField: "productId",
          foreignField: "id",
        },
        {
          from: "Bins",
          as: "binData",
          localField: "binId",
          foreignField: "id",
        },
        {
          from: "Warehouses",
          as: "warehouseData",
          localField: "warehouseId",
          foreignField: "id",
          via: "binData",
        },
      ],
    };

    const entries = await ProductEntryService.get(
      null,
      {
        barCode,
        purchaseId,
        pagination: "false",
      },
      options,
    );

    if (!entries.length) {
      throw new AppError({
        status: false,
        message: "Product Entry not found",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }

    const entry = entries[0];

    if (entry.purchaseReturnId) {
      throw new AppError({
        status: false,
        message: `Product is already returned in purchase return id ${entry.purchaseReturnId}`,
        httpStatus: httpStatus.CONFLICT,
      });
    }

    if (entry.packed) {
      throw new AppError({
        status: false,
        message: `Product is already packed with id ${entry.packingId}`,
        httpStatus: httpStatus.CONFLICT,
      });
    }

    if (entry.markedForPacking) {
      throw new AppError({
        status: false,
        message: `Product is already marked for packing with id ${entry.packingId}`,
        httpStatus: httpStatus.CONFLICT,
      });
    }

    return entry;
  }
}

export default PurchaseReturnService;
