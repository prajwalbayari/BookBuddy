import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

// Protected route for user
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized- no token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ message: "Unauthorized- no token provided" });

    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );

    if (!user) return res.status(401).json({ message: "User not found!" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Protected route
export const adminProtectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Admin not found!" });
    }

    req.user = admin;
    next();
  } catch (error) {
    console.log("Error in adminProtectedRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
