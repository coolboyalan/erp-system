import express from "express";
import asyncHandler from "#utils/asyncHandler";
import QuotationController from "#controllers/quotation";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/base-fields")
  .get(
    asyncHandler(QuotationController.getBaseFields.bind(QuotationController)),
  );

router
  .route("/update-status/:id")
  .put(
    asyncHandler(QuotationController.updateStatus.bind(QuotationController)),
  );

router
  .route("/:id?")
  .get(asyncHandler(QuotationController.get.bind(QuotationController)))
  .post(asyncHandler(QuotationController.create.bind(QuotationController)))
  .put(asyncHandler(QuotationController.update.bind(QuotationController)))
  .delete(
    asyncHandler(QuotationController.deleteDoc.bind(QuotationController)),
  );

export default router;
