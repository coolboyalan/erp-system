import express from "express";
import asyncHandler from "#utils/asyncHandler";
import StateController from "#controllers/state";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(StateController.get.bind(StateController)))
  .post(asyncHandler(StateController.create.bind(StateController)))
  .put(asyncHandler(StateController.update.bind(StateController)))
  .delete(asyncHandler(StateController.deleteDoc.bind(StateController)));

export default router;
