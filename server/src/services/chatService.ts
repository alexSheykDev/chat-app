import chatModel from '../Models/chatModel';
import messageModel from '../Models/messageModel';

export async function getUnreadCount(chatId: string, userId: string): Promise<number> {
  const chat = await chatModel.findById(chatId).lean();

  if (!chat) return 0;

  const readEntry = chat.readStatus?.find(
    (entry) => entry.userId.toString() === userId
  );
  const lastReadAt = readEntry?.lastReadAt || new Date(0);

  return await messageModel.countDocuments({
    chatId,
    updatedAt: { $gt: lastReadAt },
    senderId: { $ne: userId },
  });
}

