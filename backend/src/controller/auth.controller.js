import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import TempUser from "../models/tempUser.model.js";
import { generateToken } from "../lib/token.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
      message: "Login successful",
      admin: result,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

let transporter;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

export const initializeTransporter = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return false;
  }
  
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.verify();
    return true;
  } catch (error) {
    return false;
  }
};

try {
  initializeTransporter();
} catch (error) {
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendWelcomeEmail = async (userName, userEmail) => {
  try {
    if (!transporter) {
      const initialized = await initializeTransporter();
      if (!initialized) {
        return false;
      }
    }
    
    const mailOptions = {
      from: `BookBuddy <${process.env.EMAIL_USER || 'noreply@bookbuddy.com'}>`,
      to: userEmail,
      subject: "Welcome to BookBuddy!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6cf7; text-align: center;">Welcome to BookBuddy!</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for joining BookBuddy. We're excited to have you as part of our community!</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Share your books with the community</li>
            <li>Discover books shared by other members</li>
            <li>Connect with fellow book enthusiasts</li>
            <li>Manage your reading list and track your progress</li>
          </ul>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Happy reading!</p>
          <p style="margin-top: 30px; text-align: center; color: #777;">© ${new Date().getFullYear()} BookBuddy. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

export const sendOTP = async (req, res) => {
  const { userName, userEmail } = req.body;
  
  try {
    if (!userEmail || !userName) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    try {
      const existingUser = await User.findOne({ userEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      await TempUser.findOneAndDelete({ userEmail });

      const otp = generateOTP();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

      const tempUser = new TempUser({
        userName,
        userEmail,
        emailVerificationOTP: otp,
        otpExpiry
      });

      await tempUser.save();
      
      const savedOTP = otp;
      
    } catch (dbError) {
      return res.status(500).json({ 
        message: "Database operation failed. Please try again.",
        error: dbError.message 
      });
    }
    try {
      const savedTempUser = await TempUser.findOne({ userEmail });
      if (!savedTempUser) {
        return res.status(500).json({ message: "Failed to retrieve user data. Please try again." });
      }
      
      const savedOTP = savedTempUser.emailVerificationOTP;
      if (!transporter) {
        try {
          const initialized = await initializeTransporter();
          if (!initialized) {
            return res.status(200).json({
              message: "Verification initiated. If you don't receive an email, please contact support.",
              email: userEmail
            });
          }
        } catch (transportError) {
          return res.status(200).json({
            message: "Verification initiated. If you don't receive an email, please contact support.",
            email: userEmail
          });
        }
      }
      
      const mailOptions = {
        from: `BookBuddy <${process.env.EMAIL_USER || 'noreply@bookbuddy.com'}>`,
        to: userEmail,
        subject: "BookBuddy - Email Verification OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4a6cf7; text-align: center;">BookBuddy Email Verification</h2>
            <p>Hello ${userName},</p>
            <p>Thank you for registering with BookBuddy. To complete your registration, please use the following OTP code:</p>
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${savedOTP}
            </div>
            <p>This OTP is valid for 5 minutes only.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p style="margin-top: 30px; text-align: center; color: #777;">© ${new Date().getFullYear()} BookBuddy. All rights reserved.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      // Send success response - include OTP in development mode
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          message: "OTP sent successfully",
          email: userEmail,
          devNote: "Development mode - OTP: " + savedOTP
        });
      } else {
        return res.status(200).json({
          message: "OTP sent successfully",
          email: userEmail
        });
      }
    } catch (emailError) {
      return res.status(200).json({
        message: "Verification initiated. If you don't receive an email, please contact support.",
        email: userEmail
      });
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const verifyOTP = async (req, res) => {
  const { userEmail, otp } = req.body;
  
  try {
    if (!userEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const tempUser = await TempUser.findOne({ userEmail });
    
    if (!tempUser) {
      return res.status(400).json({ message: "No pending verification found for this email" });
    }

    if (new Date() > tempUser.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (tempUser.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    res.status(200).json({
      message: "OTP verified successfully",
      userName: tempUser.userName,
      userEmail: tempUser.userEmail
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP. Please try again." });
  }
};

export const resendOTP = async (req, res) => {
  const { userEmail } = req.body;
  
  try {
    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const tempUser = await TempUser.findOne({ userEmail });
    
    if (!tempUser) {
      return res.status(400).json({ message: "No pending verification found for this email" });
    }
    
    // Make sure we have a transporter
    if (!transporter) {
      await initializeTransporter();
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    tempUser.emailVerificationOTP = otp;
    tempUser.otpExpiry = otpExpiry;
    await tempUser.save();

    const mailOptions = {
      from: `BookBuddy <${process.env.EMAIL_USER || 'noreply@bookbuddy.com'}>`,
      to: userEmail,
      subject: "BookBuddy - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6cf7; text-align: center;">BookBuddy Email Verification</h2>
          <p>Hello ${tempUser.userName},</p>
          <p>Here is your new verification code:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes only.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p style="margin-top: 30px; text-align: center; color: #777;">© ${new Date().getFullYear()} BookBuddy. All rights reserved.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        res.status(200).json({
          message: "OTP resent successfully",
          email: userEmail,
          devNote: "Development mode - OTP: " + otp
        });
      } else {
        res.status(200).json({
          message: "OTP resent successfully",
          email: userEmail
        });
      }
    } catch (error) {
      res.status(200).json({ 
        message: "Verification initiated. If you don't receive an email, please contact support.",
        email: userEmail
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};

export const userSignup = async (req, res) => {
  const { userName, userEmail, password } = req.body;
  try {
    if (!userEmail || !userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const tempUser = await TempUser.findOne({ userEmail });
    if (!tempUser) {
      return res.status(400).json({ message: "Email not verified. Please complete verification first." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
      isEmailVerified: true,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      await TempUser.findOneAndDelete({ userEmail });
      
      sendWelcomeEmail(userName, userEmail)
        .then()
        .catch();
      
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
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      message: "Login successful",
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    let user = await User.findById(decoded.userId).select("-password");
    if (user) {
      return res.status(200).json({
        success: true,
        user: user,
        token: token,
        message: "User authenticated"
      });
    }

    let admin = await Admin.findById(decoded.userId).select("-password");
    if (admin) {
      const result = { ...admin._doc, role: "admin" };
      return res.status(200).json({
        success: true,
        user: result,
        token: token,
        message: "Admin authenticated"
      });
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
