import Warehouse from "#models/warehouse";
import BaseService from "#services/base";

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

    const total = await ProductEntry.sum("price", {
      include: [
        {
          model: Bin,
          required: true,
          where: {
            warehouseId,
          },
        },
      ],
    });

    return total;
  }
}

export default WarehouseService;
