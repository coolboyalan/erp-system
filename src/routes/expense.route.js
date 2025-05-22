import express from "express";
import asyncHandler from "#utils/asyncHandler";
import ExpenseController from "#controllers/expense";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

router.use(authentication);

router
  .route("/base-fields")
  .get(asyncHandler(ExpenseController.getBaseFields.bind(ExpenseController)));

router
  .route("/:id?")
  .get(asyncHandler(ExpenseController.get.bind(ExpenseController)))
  .post(asyncHandler(ExpenseController.create.bind(ExpenseController)))
  .put(asyncHandler(ExpenseController.update.bind(ExpenseController)))
  .delete(asyncHandler(ExpenseController.deleteDoc.bind(ExpenseController)));

export default router;
