import Book from "../models/book.model.js";
import Admin from "../models/admin.model.js";

// Get all pending requests
export const getAllRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(400).json({ message: "Unauthorized accsess!" });
    }
    const books = await Book.find({ status: "Pending" });
    return res.status(200).json({
      success: true,
      data: books,
      message: "Bookes fetched successfully!",
    });
  } catch (error) {
    console.log("Error in getAllRequests controller", error.message);
    res.status(500).json({ messgae: "Internal server Error" });
  }
};

// Approve book
export const approveBook = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(400).json({ message: "Unauthorized access!" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    if (book.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Book has already been processed" });
    }
    book.status = "Approved";
    await book.save();
    return res.status(200).json({
      success: true,
      data: book,
      message: "Book approved!",
    });
  } catch (error) {
    console.log("Error in approveBook controller", error.message);
    res.status(500).json({ messgae: "Internal server Error" });
  }
};

//Reject book
export const rejectBook = async (req, res) => { 
  const userId = req.user._id;
  const { bookId } = req.params;
  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(400).json({ message: "Unauthorized access!" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    if (book.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Book has already been processed" });
    }
    book.status = "Rejected";
    await book.save();
    return res.status(200).json({
      success: true,
      data: book,
      message: "Book rejected!",
    });
  } catch (error) {
    console.log("Error in rejectBook controller", error.message);
    res.status(500).json({ messgae: "Internal server Error" });
  }
};
