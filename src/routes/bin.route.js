import express from "express";
import asyncHandler from "#utils/asyncHandler";
import BinController from "#controllers/bin";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/all")
  .get(asyncHandler(BinController.getAll.bind(BinController)));

router
  .route("/:id?")
  .get(asyncHandler(BinController.get.bind(BinController)))
  .post(asyncHandler(BinController.create.bind(BinController)))
  .put(asyncHandler(BinController.update.bind(BinController)))
  .delete(asyncHandler(BinController.deleteDoc.bind(BinController)));

export default router;
