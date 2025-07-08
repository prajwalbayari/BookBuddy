import express from "express";
import {
  getMessages,
  sendMessage,
  getChatMembers,
} from "../controller/chat.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectedRoute);
router.get("/messages/:userId", getMessages);
router.post("/send", sendMessage);
router.get("/chat-members", getChatMembers);

export default router;
