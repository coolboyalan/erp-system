import express from "express";
import asyncHandler from "#utils/asyncHandler";
import LeadController from "#controllers/lead";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(LeadController.get.bind(LeadController)))
  .post(asyncHandler(LeadController.create.bind(LeadController)))
  .put(asyncHandler(LeadController.update.bind(LeadController)))
  .delete(asyncHandler(LeadController.deleteDoc.bind(LeadController)));

export default router;
