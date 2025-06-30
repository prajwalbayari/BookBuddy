import express from "express";
import {
  adminLogin,
  userLogin,
  userSignup,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/adminLogin", adminLogin);
router.post("/signup", userSignup);
router.post("/login", userLogin);

export default router;
