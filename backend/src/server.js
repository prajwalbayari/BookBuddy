import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import socketManager from "./lib/socket.js";
import authRoutes from "./router/auth.routes.js";
import bookRoutes from "./router/book.routes.js";
import userRoutes from "./router/user.router.js";
import adminRoutes from "./router/admin.routes.js";
import chatRoutes from "./router/chat.routes.js";

dotenv.config();
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();

// Initialize Socket.IO
socketManager.init(server);

app.use(express.json());
app.use(cookieParser());
// CORS setup for credentials
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL with fallback
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

server.listen(PORT, () => {
  console.log(`Server is now running on the port ${PORT}`);
});
