import { Server as SocketIOServer, Socket } from 'socket.io';
import messageModel from '../Models/messageModel';
import chatModel from '../Models/chatModel';

export function registerMessageHandlers(io: SocketIOServer, socket: Socket): void {
  socket.on('sendMessage', async ({ chatId, senderId, text }) => {
    try {
      const message = new messageModel({ chatId, senderId, text });
      await message.save();

      await chatModel.findByIdAndUpdate(chatId, { lastMessageId: message._id });

      io.to(chatId).emit('receiveMessage', message);
      io.to(chatId).emit('updateChatDetails', message);
    } catch (error) {
      console.error('sendMessage error:', error);
    }
  });
}
