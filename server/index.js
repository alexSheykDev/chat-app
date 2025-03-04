const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const userRoute = require('./Routes/userRoute');
const chatRoute = require('./Routes/chatRoute');
const messageRoute = require('./Routes/messageRoute');
const { verifySocketToken } = require('./middleware/auth');
const messageModel = require('./Models/messageModel');
const userModel = require('./Models/userModel');
const chatModel = require('./Models/chatModel');

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
require('dotenv').config();

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

const port = process.env.PORT || 5001;
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.log(`MongoDb connection failed: ${error.message}`));

// Store online users
const onlineUsers = new Map();
// Socket.io logic
/* io.use(verifySocketToken); */
io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Extract user ID from the token or handshake data
  const userId = socket.handshake.auth?.userId;
  const userData = await userModel.findById(userId).select('-password');

  if (userId) {
    onlineUsers.set(socket.id, userId);

    // Emit updated online users to all clients
    socket.broadcast.emit("userConnected", { userId, name: userData.name });
    io.emit('updateOnlineUsers', Array.from(new Set(onlineUsers.values())));
  }

  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId)
  } );

  socket.on("leavenChat", ({ chatId }) => {
    socket.leave(chatId);
  });

  socket.on("typing", ({ chatId, senderId }) => {
    socket.to(chatId).emit("userTyping", { senderId });
  });

  socket.on("stopTyping", ({ chatId, senderId }) => {
    socket.to(chatId).emit("userStoppedTyping", { senderId });
  });

  socket.on('sendMessage', async ({ chatId, senderId, text }) => {
    const message = new messageModel({ chatId, senderId, text });
    await message.save();

    await chatModel.findByIdAndUpdate(
      chatId,
      { lastMessageId: message._id },
      { new: true }
    );

    io.emit('receiveMessage', message);
    io.emit('updateChatDetails', message);
  });

  socket.on('disconnect', async () => {
    onlineUsers.delete(socket.id);

    io.emit('updateOnlineUsers', Array.from(new Set(onlineUsers.values())));
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});
