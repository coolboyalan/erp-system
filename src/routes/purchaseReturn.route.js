import express from "express";
import asyncHandler from "#utils/asyncHandler";
import PurchaseReturnController from "#controllers/purchaseReturn";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/barcode")
  .get(
    asyncHandler(
      PurchaseReturnController.getProductEntry.bind(PurchaseReturnController),
    ),
  );

router
  .route("/:id?")
  .get(
    asyncHandler(PurchaseReturnController.get.bind(PurchaseReturnController)),
  )
  .post(
    asyncHandler(
      PurchaseReturnController.create.bind(PurchaseReturnController),
    ),
  )
  .put(
    asyncHandler(
      PurchaseReturnController.update.bind(PurchaseReturnController),
    ),
  )
  .delete(
    asyncHandler(
      PurchaseReturnController.deleteDoc.bind(PurchaseReturnController),
    ),
  );

export default router;
