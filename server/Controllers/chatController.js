const chatModel = require('../Models/chatModel');

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
      lastMessageId: null,
    });
    const response = await newChat.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    if (!chat) return res.status(400).json('No chat is found with this id.');

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateChatLastMessage = async (req, res) => {
  const { chatId, messageId } = req.params;

  try {
    if (!chatId || !messageId) {
      return res
        .status(400)
        .json({ error: 'chatId and messageId are required' });
    }

    const updatedChat = await chatModel.findByIdAndUpdate(
      chatId,
      { lastMessageId: messageId },
      { new: true } // Return the updated document
    );

    if (!updatedChat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error updating lastMessageId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
  updateChatLastMessage,
};
