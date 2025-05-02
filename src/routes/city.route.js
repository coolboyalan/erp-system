import express from "express";
import asyncHandler from "#utils/asyncHandler";
import CityController from "#controllers/city";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(CityController.get.bind(CityController)))
  .post(asyncHandler(CityController.create.bind(CityController)))
  .put(asyncHandler(CityController.update.bind(CityController)))
  .delete(asyncHandler(CityController.deleteDoc.bind(CityController)));

export default router;
