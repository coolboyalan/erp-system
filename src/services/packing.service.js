import httpStatus from "http-status";
import Packing from "#models/packing";
import AppError from "#utils/appError";
import BinService from "#services/bin";
import BaseService from "#services/base";
import { QueryTypes, Op } from "sequelize";
import InvoiceService from "#services/invoice";
import WarehouseService from "#services/warehouse";
import QuotationService from "#services/quotation";
import { session } from "#middlewares/requestSession";
import ProductEntryService from "#services/productEntry";

class PackingService extends BaseService {
  static Model = Packing;

  static async getBaseFields() {
    const warehouseData = WarehouseService.get(
      null,
      { pagination: "false" },
      { fields: ["id"] },
    );

    const quotationData = QuotationService.get(
      null,
      {
        pagination: "false",
        status: "Approved",
        inPacking: false,
        packed: false,
      },
      { fields: ["id"] },
    );

    const [quotations, warehouses] = await Promise.all([
      quotationData,
      warehouseData,
    ]);

    return {
      quotations,
      warehouses,
    };
  }

  static async create(data) {
    data.userId = 1;
    const { quotationId, warehouseId, productData: newProducts } = data;
    const quotationData = QuotationService.getDocById(quotationId);

    const binData = BinService.get(
      null,
      { warehouseId, pagination: "false" },
      { fields: ["id", "name"] },
    );

    const [quotation, bins] = await Promise.all([quotationData, binData]);

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

    const entries = await ProductEntryService.Model.findAll({
      where: {
        id: {
          [Op.in]: entryIds,
        },
        binId: {
          [Op.in]: binIds,
        },
        packed: false,
        markedForPacking: false,
      },
    });

    if (entries.length !== entryIds.length) {
      throw new AppError({
        status: false,
        message: "Product quantity mismatch",
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    let quantity = 0;

    products.forEach((ele) => {
      if (!(ele.id in newProducts)) return;
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

    data.products = newProducts;

    const packing = await super.create(data);

    await QuotationService.Model.update(
      { products, ...(quantity ? {} : { packed: true }), inPacking: true },
      { where: { id: quotation.id } },
    );

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
        transaction: session.get("transaction"),
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

  static async updateStatus(id, data) {
    const packing = await this.Model.findDocById(id);
    const { packed } = packing;

    if (packed) {
      throw new AppError({
        status: false,
        message: "This is already packed",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    if (packing.invoiceId) {
      throw new AppError({
        status: false,
        message:
          "Invoice for this packing already exists, please remove that first",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    packing.packed = true;

    const quotation = await QuotationService.getDocById(packing.quotationId);

    quotation.inPacking = false;
    await quotation.save();

    await packing.save();
    return packing;
  }

  static async deleteDoc(id) {
    const packing = await this.Model.findDocById(id);

    if (packing.invoiceId) {
      throw new AppError({
        status: false,
        message:
          "Invoice for this packing already exists, please remove that first",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    const existingInvoice = await InvoiceService.getDoc(
      { packingId: id },
      true,
    );

    if (existingInvoice) {
      throw new AppError({
        status: false,
        message: "Invoice for this packing already exists please remove data",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    const quotation = await QuotationService.getDocById(packing.quotationId);

    const entryIds = [];
    const { products } = packing;

    for (const i in products) {
      const ele = products[i];
      ele.forEach((id) => entryIds.push(id));
    }

    const { products: newProducts } = quotation;

    newProducts.forEach((ele) => {
      if (!(ele.id in products)) return;
      ele.maxQuantity += products[ele.id].length;
    });

    await ProductEntryService.Model.update(
      {
        markedForPacking: false,
        packingId: null,
        quotationId: null,
      },
      {
        where: {
          id: {
            [Op.in]: entryIds,
          },
        },
        transaction: session.get("transaction"),
      },
    );

    await QuotationService.Model.update(
      {
        products: newProducts,
        inPacking: false,
        packed: false,
      },
      {
        where: {
          id: quotation.id,
        },
        transaction: session.get("transaction"),
      },
    );

    await packing.destroy({
      force: true,
      transaction: session.get("transaction"),
    });
  }
}

export default PackingService;
