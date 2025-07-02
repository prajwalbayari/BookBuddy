import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getUserDetails,
  updateUserDetails,
} from "../controller/user.controller.js";
import { uploadProfileImage } from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/userDetails", protectedRoute, getUserDetails);
router.patch(
  "/updateDetails",
  protectedRoute,
  uploadProfileImage,
  updateUserDetails
);

export default router;
