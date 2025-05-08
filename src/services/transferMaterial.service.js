import { Op } from "sequelize";
import BinService from "#services/bin";
import { QueryTypes } from "sequelize";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import sequelize from "#configs/database";
import httpStatus, { status } from "http-status";
import { session } from "#middlewares/requestSession";
import TransferMaterial from "#models/transferMaterial";
import ProductEntryService from "#services/productEntry";

class TransferMaterialService extends BaseService {
  static Model = TransferMaterial;

  static async create(data) {
    const { products, from, to } = data;
    const { Model: ProductEntry } = ProductEntryService;

    const productEntries = [];

    // Mark as internal if from == to
    const internal = from === to;
    data.internal = internal;

    // Collect the product entries for later bulk update
    for (const entry of products) {
      const entries = await ProductEntry.findAll({
        where: {
          binId: entry.fromBinId,
          packed: false,
          markedForPacking: false,
          id: entry.id,
        },
      });

      productEntries.push(entries);
    }

    // Perform the bulk update within a transaction
    await sequelize.transaction(async (t) => {
      const updates = [];

      for (let i = 0; i < productEntries.length; i++) {
        const entries = productEntries[i];
        const toBinId = products[i]?.toBinId;
        const fromBinId = products[i]?.fromBinId;
        const productId = products[i]?.productId;

        for (const entry of entries) {
          updates.push({ id: entry.id, toBinId, fromBinId, productId });
        }
      }

      if (updates.length > 0) {
        const updateSql = `
        UPDATE "ProductEntries"
        SET "binId" = CASE
          ${updates.map((u) => `WHEN id = ${u.id} THEN ${internal ? u.toBinId : "NULL::INTEGER"}`).join("\n")}
        END
        WHERE id IN (${updates.map((u) => u.id).join(", ")})
      `;
        await ProductEntry.sequelize.query(updateSql, { transaction: t });
      }

      data.entries = updates;
      data.stockTransferred = internal;

      // Create the transfer entry
      await super.create({ ...data }, { transaction: t });
    });

    return data;
  }

  static async get(id, filters, options = {}) {
    if (!id) {
      const fields = [
        "id",
        "destinationData.name AS toName",
        "sourceData.name AS fromName",
        "internal",
        "createdAt",
        "referenceNo",
      ];

      const lookups = [
        {
          from: "Warehouses",
          as: "destinationData",
          localField: "to",
          foreignField: "id",
        },
        {
          from: "Warehouses",
          as: "sourceData",
          localField: "from",
          foreignField: "id",
        },
      ];

      options.fields = fields;
      options.lookups = lookups;

      return await this.Model.find(filters, options);
    }

    const result = await sequelize.query(
      `SELECT
    	t.id,
    	t."referenceNo",
		toData.name AS "toName",
		fromData.name AS "fromName",
    	to_bin.name AS "toBinName",
    	prod.name AS "productName",
		prod.id AS "productId",
		(product->>'id')::int AS "productEntryId",
    	from_bin.name AS "fromBinName",
    	(product->>'barCode') AS barCode
  	FROM "TransferMaterials" t
  	CROSS JOIN LATERAL json_array_elements(t.products) AS product
  	LEFT JOIN "Bins" to_bin ON (product->>'toBinId')::int = to_bin.id
  	JOIN "Bins" from_bin ON (product->>'fromBinId')::int = from_bin.id
  	JOIN "Products" prod ON (product->>'productId')::int = prod.id
  	JOIN "Warehouses" fromData ON t.from = fromData.id
	JOIN "Warehouses" toData ON t.to = toData.id
  	WHERE t.id = :transferId;`,
      {
        replacements: { transferId: id },
        type: QueryTypes.SELECT,
      },
    );

    if (!result.length) {
      throw new AppError({
        status: false,
        message: "Transfer record not found",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }

    const response = {
      id: result[0]?.id,
      referenceNo: result[0]?.referenceNo,
      toName: result[0]?.toName,
      fromName: result[0]?.fromName,
      entries: result,
    };

    return response;
  }

  static async update(id, data) {
    const transferDoc = await this.Model.findDoc({
      id,
      internal: false,
      stockTransferred: false,
    });

    const { products } = transferDoc;
    const { products: newProducts, indexes } = data;

    const entryIds = products.map((ele) => {
      return ele.id;
    });

    const entries = await ProductEntryService.Model.findAll({
      where: {
        id: {
          [Op.in]: entryIds,
        },
        markedForPacking: false,
        packed: false,
        binId: null,
      },
      attributes: ["id", "binId"],
    });

    if (entries.length !== products.length) {
      throw new AppError({
        status: false,
        message: "Product quantity mismatch",
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    for (const product of newProducts) {
      const original = products[indexes[product.id]];

      if (!product.toBinId) {
        throw new AppError({
          status: false,
          message: "Please provide a bin id to initiate the transfer",
          httpStatus: httpStatus.BAD_REQUEST,
        });
      }

      original.binId = product.toBinId;
    }

    if (newProducts.length > 0) {
      const updateSql = `
        UPDATE "ProductEntries"
        SET "binId" = CASE
          ${newProducts.map((u) => `WHEN id = ${u.id} THEN ${u.toBinId}`).join("\n")}
        END
        WHERE id IN (${newProducts.map((u) => u.id).join(", ")})
      `;

      const transaction = session.get("transaction");
      await ProductEntryService.Model.sequelize.query(updateSql, {
        transaction,
      });
    }

    transferDoc.set("products", products);
    transferDoc.set("stockTransferred", true);
    await transferDoc.save();
  }
}

export default TransferMaterialService;
