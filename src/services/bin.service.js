import Bin from "#models/bin";
import BaseService from "#services/base";

class BinService extends BaseService {
  static Model = Bin;

  static async get(id, filters) {
    if (!id) {
      const options = {
        fields: ["id", "name"],
      };
      return await this.Model.find(filters, options);
    }
    return this.Model.findDocById(id);
  }
}

export default BinService;
