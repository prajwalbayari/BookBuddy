import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./router/auth.routes.js";
import bookRoutes from "./router/book.routes.js";
import userRoutes from "./router/user.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is now running on the port ${PORT}`);
});
