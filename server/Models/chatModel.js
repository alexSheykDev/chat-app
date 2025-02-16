const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    members: { type: [String], required: true }, // Ensure members is an array of strings
    lastMessageId: { type: String, default: null }, // Correct way to define a nullable string
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model('Chat', chatSchema);

module.exports = chatModel;
