import httpStatus from "http-status";
import AppError from "#utils/appError";
import BaseService from "#services/base";
import LeadService from "#services/lead";
import Quotation from "#models/quotation";
import LedgerService from "#services/ledger";
import PackingService from "#services/packing";
import { session } from "#middlewares/requestSession";

class QuotationService extends BaseService {
  static Model = Quotation;

  static async create(data) {
    data.userId = session.get("userId");
    return await super.create(data);
  }

  static async getBaseFields() {
    const ledgerData = LedgerService.get(
      null,
      { pagination: "false" },
      { fields: ["id", "companyName as name", "email"] },
    );
    const leadData = LeadService.get(
      null,
      { pagination: "false" },
      { fields: ["id", "name", "email"] },
    );

    const [ledgers, leads] = await Promise.all([ledgerData, leadData]);

    return {
      ledgers,
      leads,
    };
  }

  static async update(id, updates) {
    const quotation = await this.Model.findDocById(id);
    if ("status" in updates && quotation.status !== updates.status) {
      throw new AppError({
        status: false,
        message: "Cannot update quotation status from here",
        httpStatus: httpStatus.FORBIDDEN,
      });
    }

    if (quotation.status !== "Pending") {
      throw new AppError({
        status: false,
        message: `Cannot update, quotation is already ${quotation.status}`,
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    quotation.updateFields(updates);
    await quotation.save();
    return quotation;
  }

  static async updateStatus(id, updates) {
    const { status } = updates;

    const quotation = await this.Model.findDocById(id);

    if (status === quotation.status) {
      return quotation;
    }

    if (quotation.status === "Cancelled") {
      throw new AppError({
        status: false,
        message: "Cannot update status, quotation is already cancelled",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    if (quotation.packed) {
      throw new AppError({
        status: false,
        message: "Cannot update a packed quotation",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    if (quotation.status === "Approved") {
      const existingPacking = await PackingService.getDoc(
        { quotationId: id },
        true,
      );

      if (existingPacking) {
        throw new AppError({
          status: false,
          message:
            "An active packing already exist for quotation, cannot update status",
          httpStatus: httpStatus.BAD_REQUEST,
        });
      }
    }

    quotation.status = status;
    if (!quotation.ledgerId && quotation.status === "Approved") {
      const lead = await LeadService.getDocById(quotation.leadId);
      let ledger = await LedgerService.getDoc({ email: lead.email }, true);
      if (ledger) {
        quotation.ledgerId = ledger.id;
      } else {
        ledger = await LedgerService.create({
          companyName: lead.companyName ?? lead.name,
          contactName: lead.name,
          ledgerType: "Customer",
          assignedPerson: lead.assignedPerson,
          phone: lead.phone,
          email: lead.email,
          countryId: lead.countryId,
          stateId: lead.stateId,
          cityId: lead.cityId,
          pinCode: lead.pinCode,
          landmark: lead.landmark,
          streetAddress: lead.streetAddress,
        });
      }
    }
    await quotation.save();
    return quotation;
  }

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);

    const packing = await PackingService.getDoc({ quotationId: id }, true);
    if (packing) {
      throw new AppError({
        status: false,
        message: "An active packing for this quotation already exists",
        httpStatus: httpStatus.BAD_REQUEST,
      });
    }

    await doc.destroy({ force: true, transaction: session.get("transaction") });
  }
}

export default QuotationService;
