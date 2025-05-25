import { Server as SocketIOServer, Socket } from 'socket.io';

export function registerTypingHandlers(io: SocketIOServer, socket: Socket): void {
  socket.on('typing', ({ chatId, senderId }) => {
    socket.to(chatId).emit('userTyping', { senderId });
  });

  socket.on('stopTyping', ({ chatId, senderId }) => {
    socket.to(chatId).emit('userStoppedTyping', { senderId });
  });
}
