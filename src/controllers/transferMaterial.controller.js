import httpStatus from "http-status";
import TransferMaterialService from "#services/transferMaterial";
import BaseController from "#controllers/base";
import { sendResponse } from "#utils/response";

class TransferMaterialController extends BaseController {
  static Service = TransferMaterialService;
}

export default TransferMaterialController;
