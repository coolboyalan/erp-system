import Bin from "#models/bin";
import AppError from "#utils/appError";
import BaseService from "#services/base";
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
    return this.Model.findDocById(id);
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
