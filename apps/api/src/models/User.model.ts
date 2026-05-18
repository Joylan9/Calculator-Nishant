import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  guestId: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    guestId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
