import express from "express";
import {
  addBookDetails,
  getAllBooks,
  getMyBooks,
  removeBook,
  updateBookDetails,
  getBookDetails,
  getAllUsers,
  addBookFeedback,
} from "../controller/book.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { uploadBookImages } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/addBook", protectedRoute, uploadBookImages, addBookDetails);
router.patch("/updateBook/:bookId", protectedRoute, updateBookDetails);
router.delete("/removeBook/:bookId", protectedRoute, removeBook);
router.get("/getAll", protectedRoute, getAllBooks);
router.get("/myBooks", protectedRoute, getMyBooks);
router.get("/details/:bookId", protectedRoute, getBookDetails);
router.post("/feedback/:bookId", protectedRoute, addBookFeedback);
router.get("/users", protectedRoute, getAllUsers);

export default router;
