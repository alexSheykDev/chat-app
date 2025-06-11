import { Server as SocketIOServer, Socket } from 'socket.io';

export function registerGroupEvents(io: SocketIOServer, socket: Socket): void {
  socket.on("joinUserRoom", ({ userId }) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });
  socket.on('joinChat', ({ chatId }) => {
    console.log("Join chat event")
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on('leaveChat', ({ chatId }) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left room ${chatId}`);
  });

}
