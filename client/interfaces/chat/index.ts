import { IMessage } from "../message";
import { IUser } from "../user";

export interface IChat {
  _id: string;
  members: string[];
  lastMessageId?: string;
  isGroup: boolean;
  groupName?: string;
  unreadCount: number;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChatDetailed {
  _id: string;
  members: IUser[];
  lastMessageId?: IMessage;
  isGroup: boolean;
  groupName?: string;
  unreadCount: number;
  adminId?: string;
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

export interface CreateGroupChatRequest {
  groupName: string;
  memberIds: string[];
  adminId: string;
}

export type GetUserChatsResponse = IChat[] | [];
