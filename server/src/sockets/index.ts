import { Server as SocketIOServer, Socket } from 'socket.io';
import { registerMessageHandlers } from './messageHandlers';
import userModel from '../Models/userModel';
import { registerTypingHandlers } from './typingHandlers';
import { registerGroupEvents } from './groupEvents';

export class SocketManager {
  private onlineUsers: Map<string, string> = new Map();

  constructor(private io: SocketIOServer) {}

  public initialize(): void {
    this.io.on('connection', async (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      const userId = socket.handshake.auth?.userId;

      if (userId) {
        const userData = await userModel.findById(userId).select('-password');
        this.onlineUsers.set(socket.id, userId);

        socket.broadcast.emit('userConnected', { userId, name: userData?.name });
        this.io.emit('updateOnlineUsers', Array.from(new Set(this.onlineUsers.values())));
      }

      registerMessageHandlers(this.io, socket);
      registerTypingHandlers(this.io, socket);
      registerGroupEvents(this.io, socket);

      socket.on('disconnect', () => {
        this.onlineUsers.delete(socket.id);
        this.io.emit('updateOnlineUsers', Array.from(new Set(this.onlineUsers.values())));
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
}
