const chatModel = require('../Models/chatModel');
const messageModel = require('../Models/messageModel');

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  //TODO: check the data existence

  try {
    const newMessage = new messageModel({
      chatId,
      senderId,
      text,
    });
    const response = await newMessage.save();

    const updatedChat = await chatModel.findByIdAndUpdate(
      chatId,
      { lastMessageId: response._id },
      { new: true } // Return the updated document
    );

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMessageById = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await messageModel.findById(messageId);

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
};
