import { Server as SocketIOServer, Socket } from 'socket.io';
import messageModel from '../Models/messageModel';
import chatModel from '../Models/chatModel';
import { getUnreadCount } from '../services/chatService';

export function registerMessageHandlers(io: SocketIOServer, socket: Socket): void {
  socket.on('sendMessage', async ({ chatId, senderId, text }) => {
    try {
      const message = new messageModel({ chatId, senderId, text });
      await message.save();

      await chatModel.findByIdAndUpdate(chatId, { lastMessageId: message._id });

      io.to(chatId).emit('receiveMessage', message);
      io.to(chatId).emit('updateChatDetails', message);

      // Re-fetch chat to get members for unread update
      const chat = await chatModel.findById(chatId);
      if (!chat) return;

      const updateUnreadCounts = await Promise.all(
        chat.members.map(async (memberId) => {
          if (memberId.toString() !== senderId) {
            const unread = await getUnreadCount(chatId, memberId.toString());
            return { userId: memberId.toString(), unread };
          }
        })
      );

      updateUnreadCounts.forEach((entry) => {
        if (entry) {
          io.to(entry.userId).emit("chat:unread-updated", { chatId, unreadCount: entry.unread });
        }
      });
    } catch (error) {
      console.error('sendMessage error:', error);
    }
  });
}
