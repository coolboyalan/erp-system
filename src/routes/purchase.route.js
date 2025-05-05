import express from "express";
import asyncHandler from "#utils/asyncHandler";
import PurchaseController from "#controllers/purchase";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/base-fields")
  .get(asyncHandler(PurchaseController.getBaseField.bind(PurchaseController)));

router
  .route("/update-status")
  .post(asyncHandler(PurchaseController.updateStatus.bind(PurchaseController)));

router
  .route("/:id?")
  .get(asyncHandler(PurchaseController.get.bind(PurchaseController)))
  .post(asyncHandler(PurchaseController.create.bind(PurchaseController)))
  .put(asyncHandler(PurchaseController.update.bind(PurchaseController)))
  .delete(asyncHandler(PurchaseController.deleteDoc.bind(PurchaseController)));

export default router;
