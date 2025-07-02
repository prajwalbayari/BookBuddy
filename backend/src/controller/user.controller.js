import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

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
    const profileImage = req.file;

    if (profileImage && profileImage.path) {
      const uploadResponse = await cloudinary.uploader.upload(
        profileImage.path
      );
      if (uploadResponse?.secure_url) {
        console.log(uploadResponse);
        user.profilePic = uploadResponse.secure_url;
      }
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
