import Ledger from "#models/ledger";
import { session } from "#middlewares/requestSession";
import BaseService from "#services/base";
import NotificationService from "#services/notification";

class LedgerService extends BaseService {
  static Model = Ledger;

  static async create(data) {
    data.userId = session.get("userId");
    const ledger = await super.create(data);

    await NotificationService.create({
      notification: `Ledger no ${ledger.id} created by ${user.name}${user.email ? `-${user.email}` : ""}`,
      userId: data.userId,
      adminId: data.userId,
    });

    return ledger;
  }
}

export default LedgerService;
