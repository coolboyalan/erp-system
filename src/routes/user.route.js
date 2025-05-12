import express from "express";
import asyncHandler from "#utils/asyncHandler";
import UserController from "#controllers/user";
import { authentication } from "#middlewares/authentication";

const router = express.Router();

router
  .route("/login")
  .post(asyncHandler(UserController.login.bind(UserController)));

router.use(authentication);
router
  .route("/change-password/:id")
  .put(asyncHandler(UserController.changePassword.bind(UserController)));

router
  .route("/get-current")
  .get(asyncHandler(UserController.getLoggedIn.bind(UserController)));

router
  .route("/:id?")
  .get(asyncHandler(UserController.get.bind(UserController)))
  .post(asyncHandler(UserController.create.bind(UserController)))
  .put(asyncHandler(UserController.update.bind(UserController)))
  .delete(asyncHandler(UserController.deleteDoc.bind(UserController)));

export default router;
