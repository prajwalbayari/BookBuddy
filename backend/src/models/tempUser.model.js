import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    emailVerificationOTP: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // Automatically delete documents after 1 hour
    }
  },
  {
    timestamps: true,
  }
);

const TempUser = mongoose.model("TempUser", tempUserSchema);

export default TempUser;