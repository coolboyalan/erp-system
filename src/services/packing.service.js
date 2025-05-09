import httpStatus from "http-status";
import Packing from "#models/packing";
import AppError from "#utils/appError";
import { QueryTypes, Op } from "sequelize";
import BinService from "#services/bin";
import BaseService from "#services/base";
import WarehouseService from "#services/warehouse";
import QuotationService from "#services/quotation";
import ProductEntryService from "#services/productEntry";

class PackingService extends BaseService {
  static Model = Packing;

  static async create(data) {
    const { quotationId, warehouseId, products: newProducts } = data;
    const quotationData = QuotationService.getDocById(quotationId);

    const binData = BinService.get(
      null,
      { warehouseId, pagination: "false" },
      { fields: ["id", "name"] },
    );

    const existingPackingsData = this.Model.findAll({
      where: {
        quotationId,
      },
    });

    const [quotation, bins, existingPackings] = await Promise.all([
      quotationData,
      binData,
      existingPackingsData,
    ]);

    const { products } = quotation;
    const maxQuantity = {};

    for (const product of products) {
      maxQuantity[product.id] = product.maxQuantity;
    }

    const entryIds = [];
    const binIds = [];

    for (const bin of bins) {
      binIds.push(bin.id);
    }

    for (const product in newProducts) {
      if (maxQuantity[product] < newProducts[product].length) {
        throw new AppError({
          status: false,
          message: "Cannot pack more than allowed quantity",
          httpStatus: httpStatus.CONFLICT,
        });
      }

      for (const entry of newProducts[product]) {
        entryIds.push(entry);
      }
    }

    const entires = await ProductEntryService.Model.findAll({
      where: {
        id: {
          [Op.in]: entryIds,
        },
        binId: {
          [Op.in]: bins,
        },
        packed: false,
        markedForPacking: false,
      },
    });

    if (entires.length !== entryIds) {
      throw new AppError({
        status: false,
        message: "Product quantity mismatch",
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    let quantity = 0;

    products.forEach((ele) => {
      ele.maxQuantity -= newProducts[ele.id].length;
      if (ele.maxQuantity < 0) {
        throw new AppError({
          status: false,
          message: "Product entry mismatch, please contact admin",
          httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      quantity += ele.maxQuantity;
    });

    quotation.set("products", products);
    await quotation.save();

    const packing = await super.create();

    const [updatedCount] = await ProductEntryService.Model.update(
      {
        markedForPacking: true,
        packingId: packing.id,
        quotationId,
      },
      {
        where: {
          id: {
            [Op.in]: entryIds,
          },
          markedForPacking: false,
          packed: false,
          packingId: null,
          quotationId: null,
        },
      },
    );

    if (updatedCount !== entryIds.length) {
      throw new AppError({
        status: false,
        message: "Product entry mismatch error, please contact admin",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    return packing;
  }

  static async getBarCodes(filters) {
    const { quotationId, packingId, warehouseId } = filters;

    // 1. Fetch quotation and packing documents
    const quotationPromise = QuotationService.getDocById(quotationId);
    const promises = [quotationPromise];
    if (packingId) promises.push(PackingService.getDocById(packingId));

    const [quotation] = await Promise.all(promises);
    const { products } = quotation;

    // 2. Prepare product IDs and maxQuantity map
    const productIds = products.map((p) => p.id);
    const productLimits = Object.fromEntries(
      products.map((p) => [p.id, p.maxQuantity]),
    );
    const maxLimit = Math.max(...products.map((p) => p.maxQuantity));

    // 3. Run optimized SQL query
    const rawResults = await ProductEntryService.Model.sequelize.query(
      `
    SELECT * FROM (
      SELECT
        "ProductEntries"."id",
        "barCode",
        "productId",
        "binId",
        "packed",
        "packingId",
        "markedForPacking",
        "ProductEntries"."createdAt",
        "Bins"."name" AS "binName",
        ROW_NUMBER() OVER (
          PARTITION BY "productId"
          ORDER BY "ProductEntries"."createdAt" ASC
        ) AS row_num
      FROM "ProductEntries"
      INNER JOIN "Bins" ON "Bins"."id" = "ProductEntries"."binId"
      INNER JOIN "Warehouses" ON "Warehouses"."id" = "Bins"."warehouseId"
      WHERE "productId" IN (:productIds)
        AND "packingId" IS NULL
        AND "quotationId" IS NULL
        AND "packed" = FALSE
        AND "markedForPacking" = FALSE
        AND "Warehouses"."id" = :warehouseId
    ) sub
    WHERE row_num <= :maxLimit
    `,
      {
        replacements: {
          productIds,
          maxLimit,
          warehouseId,
        },
        type: QueryTypes.SELECT,
      },
    );

    // 4. Filter final output to match per-product maxQuantity
    const grouped = {};
    for (const entry of rawResults) {
      const id = entry.productId;
      if (!grouped[id]) grouped[id] = [];
      if (grouped[id].length < productLimits[id]) {
        grouped[id].push(entry);
      }
    }

    return grouped;
  }
}

export default PackingService;
