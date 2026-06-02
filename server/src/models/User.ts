import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  loyaltyPoints: number;
  rank: 'L1 – Explorer' | 'L2 – Pahaadi Soul' | 'L3 – Summit Seeker' | 'L4 – Mountain Beast' | 'L5 – Oh-Bhaisahab Legend';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    rank: {
      type: String,
      enum: [
        'L1 – Explorer',
        'L2 – Pahaadi Soul',
        'L3 – Summit Seeker',
        'L4 – Mountain Beast',
        'L5 – Oh-Bhaisahab Legend',
      ],
      default: 'L1 – Explorer',
    },
  },
  { timestamps: true }
);

const User = model<IUser>('User', UserSchema);

export default User;
