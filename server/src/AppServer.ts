import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
/* import { verifySocketToken } from './middleware/auth'; */
import userModel from './Models/userModel';

import { registerRoutes } from './Routes';
import messageModel from './Models/messageModel';
import chatModel from './Models/chatModel';

export class AppServer {
  private app: Application;
  private server: http.Server;
  private io: SocketIOServer;
  private readonly port: number = Number(process.env.PORT) || 5001;
  private readonly mongoURI: string = process.env.ATLAS_URI || '';
  private onlineUsers: Map<string, string> = new Map();

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSocketEvents();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
      })
    );
  }

  private initializeRoutes(): void {
    registerRoutes(this.app);
    /* this.app.use('/api/users', UserRoute);
    this.app.use('/api/chats', chatRoute);
    this.app.use('/api/messages', messageRoute); */
  }

  private connectToDatabase(): void {
    mongoose
      .connect(this.mongoURI)
      .then(() => console.log('MongoDB connection established'))
      .catch((error) => console.log(`MongoDB connection failed: ${error.message}`));
  }

  private initializeSocketEvents(): void {
    // Optional: this.io.use(verifySocketToken);

    this.io.on('connection', async (socket) => {
      console.log(`User connected: ${socket.id}`);

      const userId = socket.handshake.auth?.userId;

      if (userId) {
        const userData = await userModel.findById(userId).select('-password');
        this.onlineUsers.set(socket.id, userId);

        socket.broadcast.emit('userConnected', { userId, name: userData?.name });
        this.io.emit('updateOnlineUsers', Array.from(new Set(this.onlineUsers.values())));
      }

      socket.on('joinChat', ({ chatId }) => {
        socket.join(chatId);
      });

      socket.on('leavenChat', ({ chatId }) => {
        socket.leave(chatId);
      });

      socket.on('typing', ({ chatId, senderId }) => {
        socket.to(chatId).emit('userTyping', { senderId });
      });

      socket.on('stopTyping', ({ chatId, senderId }) => {
        socket.to(chatId).emit('userStoppedTyping', { senderId });
      });

      socket.on('sendMessage', async ({ chatId, senderId, text }) => {
        const message = new messageModel({ chatId, senderId, text });
        await message.save();

        await chatModel.findByIdAndUpdate(
          chatId,
          { lastMessageId: message._id },
          { new: true }
        );

        this.io.emit('receiveMessage', message);
        this.io.emit('updateChatDetails', message);
      });

      socket.on('disconnect', () => {
        this.onlineUsers.delete(socket.id);
        this.io.emit('updateOnlineUsers', Array.from(new Set(this.onlineUsers.values())));
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }
}