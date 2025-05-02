import AdminService from "#services/admin";
import BaseController from "#controllers/base";

class AdminController extends BaseController {
  static Service = AdminService;
}

export default AdminController;
