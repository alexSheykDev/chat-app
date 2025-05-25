import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    online: { type: Boolean, default: false },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
  },
  {
    timestamps: true,
  }
);

const userModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default userModel;