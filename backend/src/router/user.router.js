import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getUserDetails,
  updateUserDetails,
  changePassword,
  getBorrowedBooks,
} from "../controller/user.controller.js";
import { uploadProfileImage } from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/userDetails", protectedRoute, getUserDetails);
router.get("/borrowedBooks", protectedRoute, getBorrowedBooks);
router.patch(
  "/updateDetails",
  protectedRoute,
  uploadProfileImage,
  updateUserDetails
);
router.patch("/change-password", protectedRoute, changePassword);

export default router;
