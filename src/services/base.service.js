class BaseService {
  static Model = null;

  static async get(id, filters) {
    if (!id) {
      return await this.Model.find(filters);
    }
    return await this.Model.findDocById(id);
  }

  static async create(data) {
    const createdDoc = await this.Model.create(data);
    return createdDoc;
  }

  static async update(id, data) {
    const doc = await this.Model.findDocById(id);

    doc.updateFields(data);
    await doc.save();

    return doc;
  }

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);

    //TODO: Delete functionality has to be implemented;
  }
}

export default BaseService;
