export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  chatId: string;
  senderId: string;
  text: string;
}
