import { Model } from "sequelize";
import httpStatus from "http-status";
import AppError from "#utils/appError";
import sequelize from "#configs/database";
import { session } from "#middlewares/requestSession";
import { uploadFile } from "#configs/awsS3";

class BaseModel extends Model {
  static excludedBranchModels = ["Branch", "City", "State", "Country", "Auth"];

  /**
   * Initialize the model with the given model definition and options.
   * @param {object} modelDefinition - The model definition
   * @param {object} options - The options for the model
   */
  static initialize(modelDefinition, options) {
    const modifiedModelDefinition = this.modifyModelDefinition(modelDefinition);

    this.init(
      {
        ...modifiedModelDefinition,
        //createdBy: {
        //  type: DataTypes.INTEGER,
        //  allowNull: true,
        //  filterable: true,
        //},
        //updatedBy: {
        //  type: DataTypes.INTEGER,
        //  allowNull: true,
        //  filterable: true,
        //},
      },
      {
        hooks: {},
        ...options,
        sequelize,
        timestamps: true,
        paranoid: true,
      },
    );
  }

  static updatedName() {
    return this.name;
  }

  static modifyModelDefinition(modelDefinition) {
    return Object.entries(modelDefinition).reduce((acc, [key, value]) => {
      acc[key] = {
        ...value,
        filterable: value.filterable ?? true,
        searchable: value.searchable ?? false,
        ...(modelDefinition[key]["references"]
          ? {
              references: modelDefinition[key]["references"],
              validate: { isInt: { msg: `Invalid ${key}` } },
            }
          : {}),
      };
      return acc;
    }, {});
  }

  static async find(filters) {
    const {
      search = "",
      page = 1,
      limit = 10,
      order = [["createdAt", "DESC"]],
      sortKey,
      sortDir,
    } = filters;

    const attributes = this.rawAttributes;
    const where = {};

    // Apply filtering based on filterable fields
    Object.keys(filters).forEach((key) => {
      if (attributes[key] && attributes[key].filterable) {
        where[key] = filters[key];
      }
    });

    // Apply search across searchable fields
    if (search) {
      const searchConditions = Object.keys(attributes)
        .filter((key) => attributes[key].searchable)
        .map((key) => ({ [key]: { [Op.iLike]: `%${search}%` } }));

      if (searchConditions.length > 0) {
        where[Op.or] = searchConditions;
      }
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Fetch data with pagination
    const { count, rows } = await this.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    //WARN: Sorting and sort direction missing

    return {
      result: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        itemsPerPage: limit,
        currentPage: page,
      },
    };
  }

  static async findDocById(id, allowNull = false) {
    this.idChecker(id);

    const data = await this.findByPk(id);
    if (allowNull) {
      return data;
    }
    if (!data) {
      throw new AppError({
        status: false,
        message: `${this.name} not found with id ${id}`,
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    return data;
  }

  static async create(data, options = {}) {
    const createdDocument = await super.create(data);
    return createdDocument;
  }

  async save() {
    const transaction = session.get("transaction");

    const files = session.get("files");
    if (files?.length) {
      const attributes = this.constructor.rawAttributes;

      const filesPromises = [];
      files.forEach((file) => {
        if (attributes[file.fieldname] && attributes[file.fieldname].file) {
          const fileName = `${this.constructor.updatedName()}/${file.fieldname}/${this.dataValues.createdAt}`;
          filesPromises.push(uploadFile(fileName, file.buffer, file.mimetype));
        }
      });

      if (filesPromises.length) {
        try {
          const fileLinks = await Promise.all(filesPromises);
        } catch (err) {
          //WARN: Handle file upload revert here
        }
      }
    }

    if (!transaction) {
      throw new AppError({
        status: false,
        message: "Failed to fetch transaction",
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    await super.save({ transaction });
    return this;
  }

  static getSearchableFields(allowedFields) {
    return Object.keys(allowedFields).filter(
      (field) => allowedFields[field].searchable,
    );
  }

  static getFilterableFields(allowedFields) {
    return Object.keys(allowedFields).filter(
      (field) => allowedFields[field].filterable,
    );
  }

  static rawFields() {
    return this.getAttributes();
  }

  /**
   * Update a record by its ID.
   * @param {any} id - The ID of the record to update
   * @param {Object} updates - The updates to apply to the record
   * @return {Promise<Object>} The updated record
   */
  static async updateById(id, updates) {
    this.idChecker(id);
    const [updatedCount, updatedRecord] = await this.update(updates, {
      where: { id },
    });

    const doc = await this.findByPk(id);

    if (updatedCount !== 1) {
      throw new AppError({
        status: false,
        httpStatus: httpStatus.NOT_FOUND,
        message: `${this.name} not found`,
      });
    }
    return updatedRecord;
  }

  updateFields(updates) {
    for (let i in updates) {
      this[i] = updates[i];
    }
  }

  /**
   * Delete a record by its ID.
   *
   * @param {any} id - The ID of the record to delete
   * @return {Promise<Object>} The updated record
   */
  static async deleteById(id) {
    this.idChecker(id);
    const time = new Date();
    const [updatedCount, updatedRecord] = await this.update(
      { deletedAt: time },
      {
        where: { id, deletedAt: null },
        individualHooks: true,
      },
    );
    if (updatedCount !== 1 || !updatedRecord || !updatedRecord.length) {
      throw new AppError({
        status: false,
        httpStatus: httpStatus.NOT_FOUND,
        message: `${this.name} not found`,
      });
    }
    return updatedRecord;
  }

  static idChecker(id) {
    if (!id || isNaN(id)) {
      throw new AppError({
        status: false,
        httpStatus: httpStatus.NOT_FOUND,
        message: `Invalid or missing ${this.name} id`,
      });
    }
  }

  static objectValidator(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
}

export default BaseModel;
