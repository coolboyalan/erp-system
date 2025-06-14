import Purchase from "#models/purchase";
import BaseService from "#services/base";
import LedgerService from "#services/ledger";
import WarehouseService from "#services/warehouse";
import ProductService from "#services/product";
import AppError from "#utils/appError";
import httpStatus from "http-status";
import NotificationService from "#services/notification";
import { session } from "#middlewares/requestSession";
import UserService from "#services/user";

class PurchaseService extends BaseService {
  static Model = Purchase;

  static async get(id, filters, options = {}) {
    if (!id) {
      const fields = [
        "id",
        "totalQuantity",
        "netAmount",
        "paymentMode",
        "purchaseDate",
        "warehouseData.name AS warehouseName",
        "ledgerData.companyName AS ledgerName",
        "movedToWarehouse",
        "purchaseNo",
      ];

      const lookups = [
        {
          from: "Warehouses",
          as: "warehouseData",
          localField: "warehouseId",
          foreignField: "id",
        },
        {
          from: "Ledgers",
          as: "ledgerData",
          localField: "ledgerId",
          foreignField: "id",
        },
      ];

      options.fields = fields;
      options.lookups = lookups;

      return await this.Model.find(filters, options);
    }
    return await this.Model.findDocById(id);
  }

  static async getBaseFields() {
    const Warehouse = WarehouseService.Model;
    const Ledger = LedgerService.Model;

    const filters = { pagination: "false" };
    const options = {
      fields: ["id", "name"],
    };

    const warehouseData = Warehouse.find(filters, options);
    const ledgerData = Ledger.find(filters, {
      fields: ["id", "companyName as name", "email"],
    });

    const [warehouses, ledgers] = await Promise.all([
      warehouseData,
      ledgerData,
    ]);

    return { warehouses, ledgers };
  }

  static async create(data) {
    const { products } = data;
    data.userId = session.get("userId");

    if (!products.length) {
      throw new AppError({
        status: false,
        message: "Please add atleast one product",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    const fetchedProducts = products.map((ele) => {
      ele.maxQuantity = ele.quantity;
      return ProductService.getDocById(ele.id);
    });

    await Promise.all(fetchedProducts);

    data.movedToWarehouse = false;
    const purchase = await super.create(data);

    const user = await UserService.getDocById(data.userId);

    await NotificationService.create({
      notification: `Purchase no ${purchase.id} created by ${user.name}${user.email ? `-${user.email}` : ""}`,
      userId: data.userId,
      adminId: data.userId,
    });
  }

  static async update(id, data) {
    const purchase = await this.Model.findDocById(id);

    if (purchase.movedToWarehouse) {
      throw new AppError({
        status: false,
        message: "Cannot update, stock is already transferred to warehouse",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    const { products } = data;

    const fetchedProducts = products.map((ele) => {
      return ProductService.getDocById(ele.id);
    });

    await Promise.all(fetchedProducts);

    delete data.movedToWarehouse;

    purchase.updateFields(data);

    await purchase.save();

    return purchase;
  }

  static async moveToWarehouse(id, data) {
    const purchase = await this.Model.findDocById(id);

    const { movedToWarehouse } = data;

    if (purchase.movedToWarehouse && movedToWarehouse === false) {
      const existingProductEntry = await PurchaseService.getDoc({
        purchaseId: id,
      });
      if (existingProductEntry) {
        throw {
          status: false,
          message: `Cannot revert back the status, a product is already present in bin with the id ${existingProductEntry.binId}`,
          httpStatus: httpStatus.CONFLICT,
        };
      }
    }

    purchase.updateFields({ movedToWarehouse });

    await purchase.save();

    return purchase;
  }

  static async deleteDoc(id) {
    const purchase = await this.Model.findDocById(id);

    const existingProductEntry = await PurchaseService.getDoc({
      purchaseId: id,
    });
    if (existingProductEntry) {
      throw {
        status: false,
        message: `Cannot revert back the status, a product is already present in bin with the id ${existingProductEntry.binId}`,
        httpStatus: httpStatus.CONFLICT,
      };
    }

    if (purchase.movedToWarehouse) {
      throw new AppError({
        status: false,
        message: "Please revert the warehouse status to delete this purchase",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    await purchase.destroy({ force: true });
  }
}

export default PurchaseService;
