import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../lib/token.js";
import bcrypt from "bcryptjs";

// Login for the admin
export const adminLogin = async (req, res) => {
  const { adminEmail, password } = req.body;
  try {
    if (!adminEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const admin = await Admin.findOne({ adminEmail }).select("+password");
    if (!admin)
      return res.status(400).json({ message: "Invalid credentials!" });

    const checkPassword = await bcrypt.compare(password, admin.password);

    if (!checkPassword)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = generateToken(admin._id, res);
    const result = { ...admin._doc, role: "admin" };
    res.status(200).json({
      message: "Login successfull",
      admin: result,
      token: token,
    });
  } catch (error) {
    console.log("Error in admin login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Signup for the user
export const userSignup = async (req, res) => {
  const { userName, userEmail, password } = req.body;
  try {
    if (!userEmail || !userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return res.status(200).json({ message: "Invalid email format!" });
    }

    const user = await User.findOne({ userEmail: userEmail });

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        name: newUser.userName,
        email: newUser.userEmail,
        _id: newUser._id,
        message: "Account created successfully!",
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json("Internal server Error");
  }
};

// Login for the user
export const userLogin = async (req, res) => {
  const { userEmail, password } = req.body;
  try {
    if (!userEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ userEmail }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = generateToken(user._id, res);

    res.status(200).json({
      message: "Login successfull",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json("Internal server Error");
  }
};

// Logout for both user and admin
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
