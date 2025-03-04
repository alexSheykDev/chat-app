export interface IChat {
  _id: string;
  members: string[];
  lastMessageId?: string;
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

export type GetUserChatsResponse = IChat[] | [];
