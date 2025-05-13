import express from "express";
import asyncHandler from "#utils/asyncHandler";
import InvoiceController from "#controllers/invoice";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

router.use(authentication);

router
  .route("/base-fields")
  .get(asyncHandler(InvoiceController.getBaseFields.bind(InvoiceController)));

router
  .route("/outstanding/:id")
  .get(asyncHandler(InvoiceController.getOutstanding.bind(InvoiceController)));

router
  .route("/:id?")
  .get(asyncHandler(InvoiceController.get.bind(InvoiceController)))
  .post(asyncHandler(InvoiceController.create.bind(InvoiceController)))
  .put(asyncHandler(InvoiceController.update.bind(InvoiceController)))
  .delete(asyncHandler(InvoiceController.deleteDoc.bind(InvoiceController)));

export default router;
