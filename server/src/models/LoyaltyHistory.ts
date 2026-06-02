import { Schema, model, Document, Types } from 'mongoose';

export interface ILoyaltyHistory extends Document {
  userId: Types.ObjectId;
  trekId: Types.ObjectId;
  pointsEarned: number;
  transactionDate: Date;
}

const LoyaltyHistorySchema = new Schema<ILoyaltyHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trekId: {
      type: Schema.Types.ObjectId,
      ref: 'Trek',
      required: true,
    },
    pointsEarned: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LoyaltyHistory = model<ILoyaltyHistory>('LoyaltyHistory', LoyaltyHistorySchema);

export default LoyaltyHistory;
