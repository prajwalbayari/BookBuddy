import express from "express";
import {
  approveBook,
  getAllRequests,
  rejectBook,
} from "../controller/admin.controller.js";
import { adminProtectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getRequests", adminProtectedRoute, getAllRequests);
router.patch("/rejectBook/:bookId", adminProtectedRoute, rejectBook);
router.patch("/approveBook/:bookId", adminProtectedRoute, approveBook);

export default router;
