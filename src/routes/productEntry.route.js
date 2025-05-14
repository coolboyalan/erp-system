import express from "express";
import asyncHandler from "#utils/asyncHandler";
import ProductEntryController from "#controllers/productEntry";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/barcode")
  .get(
    asyncHandler(
      ProductEntryController.getWithBarCode.bind(ProductEntryController),
    ),
  );

router
  .route("/history")
  .get(
    asyncHandler(
      ProductEntryController.getHistory.bind(ProductEntryController),
    ),
  );

router
  .route("/:id?")
  .get(asyncHandler(ProductEntryController.get.bind(ProductEntryController)))
  .post(
    asyncHandler(ProductEntryController.create.bind(ProductEntryController)),
  )
  .put(asyncHandler(ProductEntryController.update.bind(ProductEntryController)))
  .delete(
    asyncHandler(ProductEntryController.deleteDoc.bind(ProductEntryController)),
  );

export default router;
