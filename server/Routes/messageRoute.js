const express = require('express');
const {
    createMessage,
    getMessages
} = require('../Controllers/messageController')

const router = express.Router();

router.post('/', (req, res) => {
    createMessage(req, res);
});
router.get('/:chatId', (req, res) => {
    getMessages(req, res);
});

module.exports = router;
