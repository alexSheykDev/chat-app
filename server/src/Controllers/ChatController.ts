import { Request, Response } from 'express';
import chatModel from '../Models/chatModel';
import { Types } from 'mongoose';
import { getUnreadCount } from '../services/chatService';

export class ChatController {
  public async createChat(req: Request, res: Response): Promise<void> {
    const { firstId, secondId } = req.body;

    try {
      const existingChat = await chatModel.findOne({
        members: { $all: [firstId, secondId] },
        isGroup: false,
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

    try {
      const chats = await chatModel.find({
        members: { $in: [new Types.ObjectId(userId)] },
      });

      const detailedChats = await Promise.all(
        chats.map(async (chat) => {
          const unreadCount = await getUnreadCount(chat._id.toString(), userId);
          return {
            ...chat.toObject(),
            unreadCount,
          };
        })
      );

      res.status(200).json(detailedChats);
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

  public async findChatById(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params;
    
    if (!chatId || !Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ error: 'Invalid or missing chatId' });
      return;
    }
  
    try {
      const chat = await chatModel.findById(chatId)
        .populate('members', '-password')
        .populate('lastMessageId');
    
      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }
    
      res.status(200).json(chat);
    } catch (error) {
      console.error('Find Chat By ID Error:', error);
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

  public async updateChatLastRead(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params;
    const { userId } = req.body;

    try {
      await chatModel.updateOne(
        { _id: chatId, 'readStatus.userId': userId },
        { $set: { 'readStatus.$.lastReadAt': new Date() } }
      );

      await chatModel.updateOne(
        { _id: chatId, 'readStatus.userId': { $ne: userId } },
        { $push: { readStatus: { userId, lastReadAt: new Date() } } }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update lastReadAt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async addUsersToGroupChat(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || !chatId) {
      res.status(400).json({ error: "Invalid request data" });
      return;
    }

    try {
      const updatedChat = await chatModel.findByIdAndUpdate(
        chatId,
        { $addToSet: { members: { $each: userIds } } },
        { new: true }
      );

      if (!updatedChat) {
        res.status(404).json({ error: "Chat not found" });
        return;
      }

      res.status(200).json(updatedChat);
    } catch (error) {
      console.error("Add Users to Group Chat Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async leaveGroupChat(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params;
    const { userId } = req.body;

    try {
      const chat = await chatModel.findById(chatId);
      if (!chat || !chat.isGroup) {
        res.status(404).json({ error: "Group chat not found" });
        return;
      }

      chat.members = chat.members.filter(
        (memberId) => memberId.toString() !== userId
      );

      if (chat.adminId?.toString() === userId && chat.members.length > 0) {
        chat.adminId = chat.members[0];
      }

      if (chat.members.length === 0) {
        await chatModel.findByIdAndDelete(chatId);
        res.status(200).json({ success: true, deleted: true });
        return;
      }

      await chat.save();
      res.status(200).json({ success: true, adminId: chat.adminId });
    } catch (error) {
      console.error("Leave Group Chat Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
}
