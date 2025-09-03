import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import bcrypt from "bcryptjs";

export const getUserDetails = async (req, res) => {
  const userId = req.user._id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: "User details fetched successfully!",
    });
  } catch (error) {
    console.log("Error in getUserDetails controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const updateUserDetails = async (req, res) => {
  const { userName, location } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (!userName?.trim() || !location?.trim()) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    user.userName = userName.trim();
    user.location = location.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
      message: "Profile updated!",
    });
  } catch (error) {
    console.log("Error in updateUserDetails controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          message:
            "Current password and new password are required!",
        });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          message:
            "New password must be at least 6 characters long!",
        });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.password) {
      console.log("Password field missing for user:", userId);
      return res.status(500).json({ message: "User password data not found!" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect!" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({
          message:
            "New password must be different from current password!",
        });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    console.log("Full error:", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const getBorrowedBooks = async (req, res) => {
  const userId = req.user._id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const borrowedBooks = await Book.find({ borrowedBy: userId })
      .populate("owner", "userName")
      .populate("feedback.userId", "userName userEmail")
      .sort({ updatedAt: -1 });

    const booksWithDetails = borrowedBooks.map(book => {
      const bookObj = book.toObject();
      return {
        ...bookObj,
        ownerName: book.owner && book.owner.userName ? book.owner.userName : "Unknown",
        borrowerName: user.userName || "Unknown"
      };
    });

    return res.status(200).json({
      success: true,
      data: booksWithDetails,
      message: "Borrowed books fetched successfully!",
    });
  } catch (error) {
    console.log("Error in getBorrowedBooks controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
