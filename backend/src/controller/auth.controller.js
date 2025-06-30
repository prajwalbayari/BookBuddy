import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../lib/token.js";
import bcrypt from "bcryptjs";

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
      return res.status(400).json({ message: "Invalid password!" });

    generateToken(admin._id, res);

    res.status(200).json({
      message: "Login successfull",
      _id: admin._id,
      adminEmail,
    });
  } catch (error) {
    console.log("Error in admin login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const userLogin = async (req, res) => {};
export const userSignup = async (req, res) => {};
