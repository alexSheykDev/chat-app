export interface IChat {
  _id: string;
  members: string[];
  lastMessageId?: string;
  unreadMessages?: Record<string, number>; // Maps user ID to unread count
  createdAt: string;
  updatedAt: string;
}

export interface IChatDetails {
  recipientName: string | null;
  lastMessageText: string | null;
  lastMessageTimestamp: string | null;
}

export interface CreateChatRequest {
  firstId: string;
  secondId: string;
}

export type CreateChatResponse = IChat | null;
export type GetChatDetailsResponse = IChatDetails | null;
export type GetUserChatsResponse = IChat[] | [];
