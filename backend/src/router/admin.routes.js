import express from "express";
import {
  approveBook,
  getAllRequests,
  rejectBook,
  getUsersWithBooks,
} from "../controller/admin.controller.js";
import { adminProtectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getRequests", adminProtectedRoute, getAllRequests);
router.patch("/rejectBook/:bookId", adminProtectedRoute, rejectBook);
router.patch("/approveBook/:bookId", adminProtectedRoute, approveBook);
router.get("/users-with-books", adminProtectedRoute, getUsersWithBooks);

export default router;
