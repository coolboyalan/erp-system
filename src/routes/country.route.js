import express from "express";
import asyncHandler from "#utils/asyncHandler";
import CountryController from "#controllers/country";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(CountryController.get.bind(CountryController)))
  .post(asyncHandler(CountryController.create.bind(CountryController)))
  .put(asyncHandler(CountryController.update.bind(CountryController)))
  .delete(asyncHandler(CountryController.deleteDoc.bind(CountryController)));

export default router;
