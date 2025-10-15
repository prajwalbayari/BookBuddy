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
import path from "path";
import { fileURLToPath } from "url";

// Ensure environment variables are loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 5001;
const ALT_PORT = process.env.ALT_PORT || 5002;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Try to start the server with error handling for port conflicts
const startServer = (port) => {
  const serverInstance = createServer(app);
  
  // Initialize Socket.IO on this specific server instance
  socketManager.init(serverInstance);
  
  serverInstance.listen(port)
    .on('listening', () => {
      console.log(`Server is now running on port ${port}`);
    })
    .on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use.`);
        
        // If we're trying the primary port, try the alternate port
        if (port === PORT && PORT !== ALT_PORT) {
          console.warn(`Trying alternate port ${ALT_PORT}...`);
          startServer(ALT_PORT); // Try the alternate port
        } else {
          console.error(`Both ports ${PORT} and ${ALT_PORT} are in use. Please free a port or configure a different one.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
};

// Start the server directly
(async () => {
  startServer(PORT);
})();
