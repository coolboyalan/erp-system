import cron from "node-cron";
import Quotation from "#models/quotation";
import { Sequelize } from "sequelize";

cron.schedule("0 0 * * *", async () => {
  try {
    await Quotation.update(
      {
        age: Sequelize.literal(`DATE_PART('day', NOW() - "createdAt")`),
      },
      {
        where: {},
      },
    );
  } catch (error) {
    console.error("[Cron] Error updating age:", error);
  }
});
