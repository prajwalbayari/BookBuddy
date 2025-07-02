import express from "express";
import {
  adminLogin,
  logout,
  userLogin,
  userSignup,
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/adminLogin", adminLogin);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", protectedRoute, logout);

export default router;
