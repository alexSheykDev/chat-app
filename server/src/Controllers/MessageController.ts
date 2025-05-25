// src/controllers/MessageController.ts
import { Request, Response } from 'express';
import messageModel from '../Models/messageModel';
import chatModel from '../Models/chatModel';

export class MessageController {
  public async createMessage(req: Request, res: Response): Promise<void> {
    const { chatId, senderId, text } = req.body;

    try {
      const newMessage = new messageModel({ chatId, senderId, text });
      const response = await newMessage.save();

      await chatModel.findByIdAndUpdate(
        chatId,
        { lastMessageId: response._id },
        { new: true }
      );

      res.status(200).json(response);
    } catch (error) {
      console.error('Create Message Error:', error);
      res.status(500).json(error);
    }
  }

  public async getMessages(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params;

    try {
      const messages = await messageModel.find({ chatId });
      res.status(200).json(messages);
    } catch (error) {
      console.error('Get Messages Error:', error);
      res.status(500).json(error);
    }
  }

  public async getMessageById(req: Request, res: Response): Promise<void> {
    const { messageId } = req.params;

    try {
      const message = await messageModel.findById(messageId);
      res.status(200).json(message);
    } catch (error) {
      console.error('Get Message By ID Error:', error);
      res.status(500).json(error);
    }
  }
}
