import express from "express";
import asyncHandler from "#utils/asyncHandler";
import PaymentController from "#controllers/payment";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(PaymentController.get.bind(PaymentController)))
  .post(asyncHandler(PaymentController.create.bind(PaymentController)))
  .put(asyncHandler(PaymentController.update.bind(PaymentController)))
  .delete(asyncHandler(PaymentController.deleteDoc.bind(PaymentController)));

export default router;
