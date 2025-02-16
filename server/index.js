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

// port from the env variable
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
  console.log(`⚡ User connected: ${socket.id}`);

  // Extract user ID from the token or handshake data
  const userId = socket.handshake.auth?.userId; // ✅ Read from auth handshake

  if (userId) {
    onlineUsers.set(socket.id, userId);

    await userModel.findByIdAndUpdate(userId, { online: true });

    // Emit updated online users to all clients
    io.emit('updateOnlineUsers', Array.from(new Set(onlineUsers.values())));
  }

  console.log(onlineUsers);

  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', async ({ chatId, senderId, text }) => {
    const message = new messageModel({ chatId, senderId, text });
    await message.save();
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', async () => {
    const userId = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);

    // Check if the user is still connected on another socket
    const isStillOnline = [...onlineUsers.values()].includes(userId);
    if (!isStillOnline) {
      await userModel.findByIdAndUpdate(userId, { online: false });
    }

    io.emit('updateOnlineUsers', Array.from(new Set(onlineUsers.values())));
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});
