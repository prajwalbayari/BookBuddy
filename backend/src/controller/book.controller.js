import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

// Add a new book
export const addBookDetails = async (req, res) => {
  const { bookName, edition, description, url } = req.body;
  const userId = req.user._id;
  try {
    if (!bookName?.trim() || !edition || !description?.trim()) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (
      isNaN(parseInt(edition)) ||
      parseInt(edition) <= 0 ||
      !Number.isInteger(Number(edition))
    ) {
      return res.status(400).json({
        message: "Edition must be a valid positive integer!",
      });
    }

    // Validate URL if provided
    if (url && url.trim()) {
      // Comprehensive URL regex that handles most common cases
      const urlPattern = /^(https?:\/\/)?([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,63})([\/\w \.\-~:?#\[\]@!$&'()*+,;=%]*)*\/?$/i;
      
      // Block dangerous protocols
      const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
      if (dangerousProtocols.test(url.trim())) {
        return res.status(400).json({
          message: "Invalid URL protocol detected!",
        });
      }
      
      if (!urlPattern.test(url.trim())) {
        return res.status(400).json({
          message: "Please provide a valid URL for the book softcopy!",
        });
      }
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    const bookImages = req.files?.bookImages;
    const uploadedImages = [];

    if (Array.isArray(bookImages)) {
      for (const image of bookImages) {
        if (image) {
          const uploadResponse = await cloudinary.uploader.upload(image.path);
          if (uploadResponse?.secure_url)
            uploadedImages.push(uploadResponse.secure_url);
        }
      }
    }

    const book = await Book.create({
      bookName: bookName.trim(),
      edition: parseInt(edition),
      description: description.trim(),
      owner: userId,
      bookImages: uploadedImages,
      url: url && url.trim() ? url.trim() : null,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully!",
      book: book,
    });
  } catch (error) {
    console.log("Error in addBookDetails controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Update details of book that already exist in database
export const updateBookDetails = async (req, res) => {
  const { bookName, edition, description, available, borrowerId, url } = req.body;
  const userId = req.user._id;
  const { bookId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    if (
      !bookName?.trim() ||
      !edition ||
      !description?.trim() ||
      !available?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate URL if provided
    if (url && url.trim()) {
      // Comprehensive URL regex that handles most common cases
      const urlPattern = /^(https?:\/\/)?([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,63})([\/\w \.\-~:?#\[\]@!$&'()*+,;=%]*)*\/?$/i;
      
      // Block dangerous protocols
      const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
      if (dangerousProtocols.test(url.trim())) {
        return res.status(400).json({
          message: "Invalid URL protocol detected!",
        });
      }
      
      if (!urlPattern.test(url.trim())) {
        return res.status(400).json({
          message: "Please provide a valid URL for the book softcopy!",
        });
      }
    }

    if (
      isNaN(parseInt(edition)) ||
      parseInt(edition) <= 0 ||
      !Number.isInteger(Number(edition))
    ) {
      return res.status(400).json({
        message: "Edition must be a valid positive integer!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }

    // Validate borrowerId if provided
    if (borrowerId && !mongoose.Types.ObjectId.isValid(borrowerId)) {
      return res.status(400).json({ message: "Invalid Borrower ID" });
    }

    // Validate that borrower exists if borrowerId is provided
    if (borrowerId) {
      const borrower = await User.findById(borrowerId);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found!" });
      }
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    if (book.owner.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    book.bookName = bookName.trim();
    book.available = available.trim();
    book.edition = parseInt(edition);
    book.description = description.trim();
    book.url = url && url.trim() ? url.trim() : null;

    // Handle borrowedBy field based on book status
    if (available.trim() === "Borrowed" && borrowerId) {
      book.borrowedBy = borrowerId;
    } else if (["Available", "Requested", "Returned"].includes(available.trim())) {
      book.borrowedBy = null;
    }

    await book.save();

    return res.status(200).json({
      success: true,
      data: book,
      message: "Book details updated successfully!",
    });
  } catch (error) {
    console.log("Error in updateBookDetails controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Remove a book from database
export const removeBook = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    if (book.owner.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    const bookImages = book.bookImages;
    await Book.findByIdAndDelete(bookId);
    if (Array.isArray(bookImages) && bookImages.length > 0) {
      for (const image of bookImages) {
        const publicId = image.split("/").slice(-1)[0].split(".")[0];
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from cloudinary. Result:", result);
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Book deleted successfully!" });
  } catch (error) {
    console.log("Error in removeBook controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Fecth all books
export const getAllBooks = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    const books = await Book.find({
      owner: { $ne: userId },
      status: "Approved",
    })
    .populate("owner", "userName")
    .populate("borrowedBy", "userName")
    .populate("feedback.userId", "userName userEmail");

    const booksWithDetails = books.map(book => {
      const bookObj = book.toObject();
      return {
        ...bookObj,
        ownerName: book.owner && book.owner.userName ? book.owner.userName : "Unknown",
        borrowerName: book.borrowedBy && book.borrowedBy.userName ? book.borrowedBy.userName : null
      };
    });

    res.status(200).json({
      success: true,
      data: booksWithDetails,
      message: "Fetched all the books successfully!",
    });
  } catch (error) {
    console.log("Error in getAllBooks controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Fetch all the books owned by a user
export const getMyBooks = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    const books = await Book.find({ owner: userId })
      .populate("borrowedBy", "userName")
      .populate("feedback.userId", "userName userEmail");
    
    const booksWithDetails = books.map(book => {
      const bookObj = book.toObject();
      return {
        ...bookObj,
        ownerName: user.userName || "Unknown",
        borrowerName: book.borrowedBy && book.borrowedBy.userName ? book.borrowedBy.userName : null
      };
    });
    
    res.status(200).json({
      success: true,
      data: booksWithDetails,
      message: "Fetched book successfully!",
    });
  } catch (error) {
    console.log("Error in getMyBooks controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Fetch details of an individual book
export const getBookDetails = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }

    // First try to find an approved book (for general browsing)
    let book = await Book.findOne({ _id: bookId, status: "Approved" })
      .select("-status")
      .populate("owner", "userName")
      .populate("borrowedBy", "userName")
      .populate("feedback.userId", "userName userEmail");
      
    // If not found and user is the owner, allow access to their own book regardless of status
    if (!book) {
      book = await Book.findOne({ _id: bookId, owner: userId })
        .populate("owner", "userName")
        .populate("borrowedBy", "userName")
        .populate("feedback.userId", "userName userEmail");
    }
      
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    const ownerName = book.owner && book.owner.userName ? book.owner.userName : "Unknown";
    const borrowerName = book.borrowedBy && book.borrowedBy.userName ? book.borrowedBy.userName : null;

    const bookData = {
      ...book.toObject(),
      ownerName,
      borrowerName
    };

    return res.status(200).json({
      success: true,
      data: bookData,
      message: "Book details fetched successfully!",
    });
  } catch (error) {
    console.log("Error in getBookDetails controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Get all users for borrower selection
export const getAllUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    const users = await User.find({ _id: { $ne: userId } }).select("_id userName");

    res.status(200).json({
      success: true,
      data: users,
      message: "Fetched all users successfully!",
    });
  } catch (error) {
    console.log("Error in getAllUsers controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Add feedback to a book
export const addBookFeedback = async (req, res) => {
  const { bookId } = req.params;
  const { rating, description } = req.body;
  const userId = req.user._id;

  try {
    // Validate input
    if (!rating || !description?.trim()) {
      return res.status(400).json({ message: "Rating and description are required!" });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5!" });
    }

    // Validate book exists
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID!" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    // Prevent book owners from giving feedback to their own books
    if (book.owner.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot give feedback to your own book!" });
    }

    // Check if user already gave feedback for this book
    const existingFeedback = book.feedback.find(
      (feedback) => feedback.userId.toString() === userId.toString()
    );

    if (existingFeedback) {
      return res.status(400).json({ message: "You have already provided feedback for this book!" });
    }

    // Add feedback to the book
    const newFeedback = {
      rating: parseInt(rating),
      description: description.trim(),
      userId: userId,
    };

    book.feedback.push(newFeedback);
    await book.save();

    // Populate the user details for the response
    await book.populate({
      path: 'feedback.userId',
      select: 'userName userEmail'
    });

    res.status(201).json({
      success: true,
      message: "Feedback added successfully!",
      data: book.feedback[book.feedback.length - 1],
    });
  } catch (error) {
    console.log("Error in addBookFeedback controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
