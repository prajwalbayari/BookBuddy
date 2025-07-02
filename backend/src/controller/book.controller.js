import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

// Add a new book
export const addBookDetails = async (req, res) => {
  const { bookName, edition, description } = req.body;
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
  const { bookName, edition, description, available } = req.body;
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
    });

    res.status(200).json({
      success: true,
      data: books,
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
    const books = await Book.find({ owner: userId });
    res.status(200).json({
      success: true,
      data: books,
      message: "Fetched book successfully!",
    });
  } catch (error) {
    console.log("Error in getMyBooks controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
