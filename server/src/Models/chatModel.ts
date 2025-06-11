import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReadStatus {
  userId: Types.ObjectId | string;
  lastReadAt: Date;
}
export interface IChat extends Document {
   _id: Types.ObjectId;
  members: (Types.ObjectId | string)[];
  lastMessageId?: Types.ObjectId | string | null;
  isGroup: boolean;
  groupName?: string;
  adminId?: Types.ObjectId | string;
  readStatus: IReadStatus[];
  createdAt?: Date;
  updatedAt?: Date;
}

const chatSchema: Schema<IChat> = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
    lastMessageId: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    readStatus: {type: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      lastReadAt: { type: Date, required: true },
    },
  ],
  default: [],}
  },
  {
    timestamps: true,
  }
);

const chatModel: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);
export default chatModel;
