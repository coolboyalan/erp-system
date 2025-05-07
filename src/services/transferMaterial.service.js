import httpStatus, { status } from "http-status";
import BinService from "#services/bin";
import { QueryTypes } from "sequelize";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import sequelize from "#configs/database";
import TransferMaterial from "#models/transferMaterial";
import ProductEntryService from "#services/productEntry";
import { session } from "#middlewares/requestSession";

class TransferMaterialService extends BaseService {
  static Model = TransferMaterial;

  static async bulkUpdateBinIds(productEntries, products, transaction) {
    const updates = [];

    for (let i = 0; i < productEntries.length; i++) {
      const entries = productEntries[i];
      const toBinId = products[i]?.toBinId;

      for (const entry of entries) {
        updates.push({ id: entry.id, toBinId });
      }
    }

    if (updates.length === 0) return;

    const updateSql = `
    UPDATE "ProductEntries"
    SET "binId" = CASE
      ${updates.map((u) => `WHEN id = ${u.id} THEN ${u.toBinId}`).join("\n")}
    END
    WHERE id IN (${updates.map((u) => u.id).join(", ")})
  `;

    await this.Model.sequelize.query(updateSql, {
      transaction: session.get("transaction"),
    });
  }

  static async create(data) {
    const { products, from, to } = data;
    const { Model: ProductEntry } = ProductEntryService;

    const productEntries = [];

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

        for (const entry of entries) {
          updates.push({ id: entry.id, toBinId });
        }
      }

      if (updates.length > 0) {
        const updateSql = `
        UPDATE "ProductEntries"
        SET "binId" = CASE
          ${updates.map((u) => `WHEN id = ${u.id} THEN ${u.toBinId}`).join("\n")}
        END
        WHERE id IN (${updates.map((u) => u.id).join(", ")})
      `;
        await ProductEntry.sequelize.query(updateSql, { transaction: t });
      }

      // Mark as internal if from == to
      data.internal = from === to;

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
    	from_bin.name AS "fromBinName",
    	(product->>'barCode') AS barCode
  	FROM "TransferMaterials" t
  	CROSS JOIN LATERAL json_array_elements(t.products) AS product
  	JOIN "Bins" to_bin ON (product->>'toBinId')::int = to_bin.id
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
        httpStatus: httpStatus.BAD_REQUEST,
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
}

export default TransferMaterialService;
