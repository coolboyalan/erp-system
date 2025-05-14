import Bin from "#models/bin";
import httpStatus from "http-status";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import sequelize from "#configs/database";
import ProductEntryService from "#services/productEntry";

class BinService extends BaseService {
  static Model = Bin;

  static async get(id, filters, options) {
    if (!id) {
      const options = {
        fields: ["id", "name"],
      };
      return await this.Model.find(filters, options);
    }

    const query = `
  				SELECT
    				COUNT(*) AS quantity,
    				"Products"."id" AS "productId",
    				"Products"."code" AS "productCode",
    				"Products"."name"
  				FROM "ProductEntries" AS "data"
  				INNER JOIN "Products" ON "Products"."id" = "data"."productId"
  				WHERE "data"."binId" = ${id}
  				GROUP BY "Products"."id", "Products"."code", "Products"."name"
`;
    const [data] = await sequelize.query(query);
    return data;
  }

  static async getAll() {
    const options = {
      fields: ["id", "name", "warehouseData.name AS warehouseName"],
      lookups: [
        {
          from: "Warehouses",
          as: "warehouseData",
          localField: "warehouseId",
          foreignField: "id",
        },
      ],
    };

    const data = await this.Model.find({ pagination: "false" }, options);
    return data;
  }

  static async deleteDoc(id) {
    const bin = await this.Model.findDocById(id);

    const existingProducts = await ProductEntryService.getDoc(
      { binId: id },
      true,
    );
    if (existingProducts) {
      throw new AppError({
        status: false,
        message: "Bin is not empty",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    await bin.destroy({ force: true });
  }
}

export default BinService;
