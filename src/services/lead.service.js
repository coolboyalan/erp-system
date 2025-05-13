import Lead from "#models/lead";
import BaseService from "#services/base";
import { session } from "#middlewares/requestSession";
import NotificationService from "#services/notification";
import UserService from "#services/user";

class LeadService extends BaseService {
  static Model = Lead;

  static async create(data) {
    data.userId = session.get("userId");
    const lead = await super.create(data);
    const user = await UserService.getDocById(data.userId);

    await NotificationService.create({
      notification: `Lead no ${lead.id} created by ${lead.id} created by ${user.name}${user.email ? `-${user.email}` : ""}`,
      userId: data.userId,
      adminId: data.userId,
    });

    return lead;
  }
}

export default LeadService;
