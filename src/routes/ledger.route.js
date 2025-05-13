import express from "express";
import asyncHandler from "#utils/asyncHandler";
import LedgerController from "#controllers/ledger";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(LedgerController.get.bind(LedgerController)))
  .post(asyncHandler(LedgerController.create.bind(LedgerController)))
  .put(asyncHandler(LedgerController.update.bind(LedgerController)))
  .delete(asyncHandler(LedgerController.deleteDoc.bind(LedgerController)));

export default router;
