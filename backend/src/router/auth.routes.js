import express from "express";
import {
  adminLogin,
  logout,
  userLogin,
  userSignup,
  checkAuth,
  sendOTP,
  verifyOTP,
  resendOTP
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/adminLogin", adminLogin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", protectedRoute, logout);
router.get("/check", checkAuth);

export default router;
