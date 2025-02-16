const express = require('express');
const {
  createMessage,
  getMessages,
  getMessageById,
} = require('../Controllers/messageController');

const router = express.Router();

router.post('/', (req, res) => {
  createMessage(req, res);
});
router.get('/:chatId', (req, res) => {
  getMessages(req, res);
});
router.get('/find/:messageId', (req, res) => {
  getMessageById(req, res);
});

module.exports = router;
