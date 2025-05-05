import Purchase from "#models/purchase";
import BaseService from "#services/base";
import LedgerService from "#services/ledger";
import WarehouseService from "#services/warehouse";

class PurchaseService extends BaseService {
  static Model = Purchase;

  static async getBaseFields() {
    const Warehouse = WarehouseService.Model;
    const Ledger = LedgerService.Model;

    const filters = { pagination: "false" };
    const options = {
      fields: ["id", "name"],
    };

    const warehouseData = Warehouse.find(filters, options);
    const ledgerData = Ledger.find(filters, { fields: ["id", "companyName"] });

    const [warehouses, ledgers] = await Promise.all([
      warehouseData,
      ledgerData,
    ]);

    return { warehouses, ledgers };
  }
}

export default PurchaseService;
