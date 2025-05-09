import express from "express";
import asyncHandler from "#utils/asyncHandler";
import PackingController from "#controllers/packing";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

router.use(authentication);

router
  .route("/barcodes")
  .get(asyncHandler(PackingController.getBarcodes.bind(PackingController)));

router
  .route("/:id?")
  .get(asyncHandler(PackingController.get.bind(PackingController)))
  .post(asyncHandler(PackingController.create.bind(PackingController)))
  .put(asyncHandler(PackingController.update.bind(PackingController)))
  .delete(asyncHandler(PackingController.deleteDoc.bind(PackingController)));

export default router;
