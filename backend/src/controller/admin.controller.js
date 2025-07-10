import Book from "../models/book.model.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

// Get all pending requests
export const getAllRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(400).json({ message: "Unauthorized accsess!" });
    }
    const books = await Book.find({ status: "Pending" }).populate({
      path: 'owner',
      select: 'userName',
    });

    const booksWithUser = books.map(book => ({
      ...book.toObject(),
      requestedBy: book.owner?.userName || 'Unknown',
    }));
    return res.status(200).json({
      success: true,
      data: booksWithUser,
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

// Get all users mapped with their owned books
export const getUsersWithBooks = async (req, res) => {
  try {
    const users = await User.find({}, 'userName userEmail');

    const books = await Book.find({ status: "Approved" })
      .populate('owner', 'userName')
      .populate('borrowedBy', 'userName')
      .select('bookName edition description owner borrowedBy available createdAt');

    const userBooksMap = {};
    users.forEach(user => {
      userBooksMap[user._id] = {
        userName: user.userName,
        userEmail: user.userEmail,
        books: []
      };
    });

    books.forEach(book => {
      const ownerId = book.owner?._id?.toString();
      if (userBooksMap[ownerId]) {
        userBooksMap[ownerId].books.push({
          bookName: book.bookName,
          edition: book.edition,
          description: book.description,
          bookId: book._id,
          ownerName: book.owner?.userName,
          borrowerName: book.borrowedBy?.userName || null,
          available: book.available,
          createdAt: book.createdAt
        });
      }
    });

    const result = Object.values(userBooksMap);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Fetched users with their books successfully!"
    });
  } catch (error) {
    console.log("Error in getUsersWithBooks controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
