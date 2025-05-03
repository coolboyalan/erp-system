import express from "express";
import asyncHandler from "#utils/asyncHandler";
import WarehouseController from "#controllers/warehouse";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(WarehouseController.get.bind(WarehouseController)))
  .post(asyncHandler(WarehouseController.create.bind(WarehouseController)))
  .put(asyncHandler(WarehouseController.update.bind(WarehouseController)))
  .delete(asyncHandler(WarehouseController.deleteDoc.bind(WarehouseController)));

export default router;
