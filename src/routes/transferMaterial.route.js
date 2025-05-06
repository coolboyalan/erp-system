import express from "express";
import asyncHandler from "#utils/asyncHandler";
import TransferMaterialController from "#controllers/transferMaterial";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(
    asyncHandler(
      TransferMaterialController.get.bind(TransferMaterialController),
    ),
  )
  .post(
    asyncHandler(
      TransferMaterialController.create.bind(TransferMaterialController),
    ),
  )
  .put(
    asyncHandler(
      TransferMaterialController.update.bind(TransferMaterialController),
    ),
  )
  .delete(
    asyncHandler(
      TransferMaterialController.deleteDoc.bind(TransferMaterialController),
    ),
  );

export default router;
