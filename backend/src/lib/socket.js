import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.onlineUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // socketId -> userId
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        let token = socket.handshake.auth.token;
        
        // Parse cookies if no auth token
        if (!token && socket.handshake.headers.cookie) {
          const cookies = socket.handshake.headers.cookie.split(';');
          for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'jwt') {
              token = value;
              break;
            }
          }
        }
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });

    this.io.on('connection', (socket) => {
      this.onlineUsers.set(socket.userId, socket.id);
      this.userSockets.set(socket.id, socket.userId);

      socket.join(socket.userId);

      this.broadcastOnlineUsers();

      // Handle real-time message sending (supplementary to REST API)
      socket.on('send_message', (data) => {
        const { receiverId, message } = data;
        
        const messageData = {
          senderId: socket.userId,
          receiverId,
          message,
          timestamp: new Date(),
          sender: {
            name: socket.user.name,
            email: socket.user.email
          }
        };

        socket.to(receiverId).emit('receive_message', messageData);
      });

      socket.on('disconnect', () => {
        this.onlineUsers.delete(socket.userId);
        this.userSockets.delete(socket.id);
        this.broadcastOnlineUsers();
      });
    });

    return this.io;
  }

  broadcastOnlineUsers() {
    const onlineUsersList = Array.from(this.onlineUsers.keys());
    this.io.emit('online_users', onlineUsersList);
  }

  sendToUser(userId, event, data) {
    const socketId = this.onlineUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }
}

const socketManager = new SocketManager();

export default socketManager;
