// src/controllers/ChatController.ts
import { Request, Response } from 'express';
import chatModel from '../Models/chatModel';
import { Types } from 'mongoose';

export class ChatController {
  public async createChat(req: Request, res: Response): Promise<void> {
    const { firstId, secondId } = req.body;

    try {
      const existingChat = await chatModel.findOne({
        members: { $all: [firstId, secondId] },
      });

      if (existingChat) {
        res.status(200).json(existingChat);
        return;
      }

      const newChat = new chatModel({
        members: [firstId, secondId],
        lastMessageId: null,
      });

      const savedChat = await newChat.save();
      res.status(200).json(savedChat);
    } catch (error) {
      console.error('Create Chat Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async createGroupChat(req: Request, res: Response): Promise<void> {
    const { memberIds, groupName, adminId } = req.body;

    if (!groupName || !Array.isArray(memberIds) || !adminId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const groupChat = await chatModel.create({
        members: [...memberIds, adminId],
        groupName,
        adminId,
        isGroup: true,
      });

      res.status(201).json(groupChat);
    } catch (error) {
      console.error('Create Group Chat Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  public async findUserChats(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    console.log(userId)

    try {
      const chats = await chatModel.find({
        members: { $in: [new Types.ObjectId(userId)] },
      });

      console.log(chats)

      res.status(200).json(chats);
    } catch (error) {
      console.error('Find User Chats Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async findChat(req: Request, res: Response): Promise<void> {
    const { firstId, secondId } = req.params;

    try {
      const chat = await chatModel.findOne({
        members: { $all: [firstId, secondId] },
      });

      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }

      res.status(200).json(chat);
    } catch (error) {
      console.error('Find Chat Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async updateChatLastMessage(req: Request, res: Response): Promise<void> {
    const { chatId, messageId } = req.params;

    try {
      if (!chatId || !messageId) {
        res.status(400).json({ error: 'chatId and messageId are required' });
        return;
      }

      const updatedChat = await chatModel.findByIdAndUpdate(
        chatId,
        { lastMessageId: messageId },
        { new: true }
      );

      if (!updatedChat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }

      res.status(200).json(updatedChat);
    } catch (error) {
      console.error('Update Chat LastMessageId Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
