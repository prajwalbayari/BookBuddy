import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import socketManager from "../lib/socket.js";
import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId }
      ]
    })
    .populate("senderId", "name email")
    .populate("receiverId", "name email")
    .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and message text are required"
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID"
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found"
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text.trim()
    });

    const savedMessage = await newMessage.save();

    await savedMessage.populate("senderId", "name email");
    await savedMessage.populate("receiverId", "name email");

    try {
      const messageData = {
        _id: savedMessage._id,
        senderId: savedMessage.senderId._id,
        receiverId: savedMessage.receiverId._id,
        text: savedMessage.text,
        createdAt: savedMessage.createdAt,
        sender: {
          name: savedMessage.senderId.name,
          email: savedMessage.senderId.email
        }
      };

      socketManager.sendToUser(receiverId.toString(), 'receive_message', messageData);
    } catch (socketError) {
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getChatMembers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId }
      ]
    })
    .populate("senderId", "name email")
    .populate("receiverId", "name email")
    .sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.status(200).json({
        success: true,
        chatMembers: []
      });
    }

    const chatPartnersMap = new Map();

    messages.forEach((message) => {
      const partnerId = message.senderId._id.toString() === currentUserId.toString() 
        ? message.receiverId._id.toString()
        : message.senderId._id.toString();

      const partner = message.senderId._id.toString() === currentUserId.toString() 
        ? message.receiverId
        : message.senderId;

      if (!chatPartnersMap.has(partnerId)) {
        chatPartnersMap.set(partnerId, {
          _id: partner._id,
          name: partner.name,
          email: partner.email,
          lastMessageText: message.text,
          lastMessageTime: message.createdAt
        });
      }
    });

    const chatMembers = Array.from(chatPartnersMap.values());

    res.status(200).json({
      success: true,
      chatMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
