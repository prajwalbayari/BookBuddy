import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure environment variables are loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");
console.log("DB: Loading environment variables from:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("DB: Environment variables loaded successfully");
}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables. Please check your .env file.");
    }
    
    console.log("Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected successfully ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);  // Exit with failure on database connection error
  }
};
