import express from "express";
import asyncHandler from "#utils/asyncHandler";
import ReceivingController from "#controllers/receiving";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

router.use(authentication);

router
  .route("/total/:id")
  .get(asyncHandler(ReceivingController.getTotal.bind(ReceivingController)));

router
  .route("/:id?")
  .get(asyncHandler(ReceivingController.get.bind(ReceivingController)))
  .post(asyncHandler(ReceivingController.create.bind(ReceivingController)))
  .put(asyncHandler(ReceivingController.update.bind(ReceivingController)))
  .delete(
    asyncHandler(ReceivingController.deleteDoc.bind(ReceivingController)),
  );

export default router;
