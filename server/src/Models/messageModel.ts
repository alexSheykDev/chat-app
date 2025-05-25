import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMessage extends Document {
  chatId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, required: true, ref: 'Chat' },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const messageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
export default messageModel;