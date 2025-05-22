import BaseService from "#services/base";
import Warehouse from "#models/warehouse";
import sequelize from "#configs/database";
import httpStatus from "http-status";

class WarehouseService extends BaseService {
  static Model = Warehouse;

  static async get(id, filter, options = {}) {
    if (!id) {
      const lookups = [
        {
          from: "Cities",
          as: "cityData",
          localField: "cityId",
          foreignField: "id",
        },
        {
          from: "States",
          as: "stateData",
          localField: "stateId",
          foreignField: "id",
        },
        {
          from: "Countries",
          as: "countryData",
          localField: "countryId",
          foreignField: "id",
        },
      ];
      const fields = [
        "cityData.name AS city",
        "stateData.name as state",
        "countryData.name as country",
        "Warehouses.name",
        "Warehouses.id",
        "Warehouses.createdAt",
        "pinCode",
      ];

      options.fields = fields;
      options.lookups = lookups;

      return await this.Model.find(filter, options);
    }

    return await this.Model.findDocById(id);
  }

  static async getTotalValue(warehouseId) {
    await this.getDocById(warehouseId);

    const [result] = await sequelize.query(
      `
  SELECT SUM("ProductEntry"."price") as total, COUNT(*) as quantity
  FROM "ProductEntries" AS "ProductEntry"
  INNER JOIN "Bins" AS "Bin" ON "ProductEntry"."binId" = "Bin"."id"
  WHERE "Bin"."warehouseId" = :warehouseId AND "ProductEntry"."deletedAt" IS NULL AND "Bin"."deletedAt" IS NULL AND "packed" = FALSE AND "purchaseReturnId" IS NULL AND "markedForPacking" = FALSE
`,
      {
        replacements: { warehouseId }, // or pass it dynamically
        type: sequelize.QueryTypes.SELECT,
      },
    );
    return { total: result.total, quantity: result.quantity };
  }
}

export default WarehouseService;
