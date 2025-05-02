import express from "express";
import asyncHandler from "#utils/asyncHandler";
import ProductController from "#controllers/product";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(ProductController.get.bind(ProductController)))
  .post(asyncHandler(ProductController.create.bind(ProductController)))
  .put(asyncHandler(ProductController.update.bind(ProductController)))
  .delete(asyncHandler(ProductController.deleteDoc.bind(ProductController)));

export default router;
