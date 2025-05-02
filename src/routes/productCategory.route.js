import express from "express";
import asyncHandler from "#utils/asyncHandler";
import ProductCategoryController from "#controllers/productCategory";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(ProductCategoryController.get.bind(ProductCategoryController)))
  .post(asyncHandler(ProductCategoryController.create.bind(ProductCategoryController)))
  .put(asyncHandler(ProductCategoryController.update.bind(ProductCategoryController)))
  .delete(asyncHandler(ProductCategoryController.deleteDoc.bind(ProductCategoryController)));

export default router;
