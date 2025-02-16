const express = require('express');
const {
  createChat,
  findUserChats,
  findChat,
  updateChatLastMessage,
} = require('../Controllers/chatController');

const router = express.Router();

router.post('/', (req, res) => {
  createChat(req, res);
});
router.get('/:userId', (req, res) => {
  findUserChats(req, res);
});
router.get('/find/:firstId/:secondId', (req, res) => {
  findChat(req, res);
});

router.patch('/:chatId/:messageId', (req, res) => {
  updateChatLastMessage(req, res);
});

module.exports = router;
