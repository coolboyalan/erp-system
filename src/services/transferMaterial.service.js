import TransferMaterial from "#models/transferMaterial";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import ProductEntryService from "#services/productEntry";
import sequelize from "#configs/database";

class TransferMaterialService extends BaseService {
  static Model = TransferMaterial;
}

export default TransferMaterialService;
