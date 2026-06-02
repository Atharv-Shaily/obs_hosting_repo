import { Schema, model, Document } from 'mongoose';

export interface ITrek extends Document {
  title: string;
  description: string;
  loyaltyReward: number;
}

const TrekSchema = new Schema<ITrek>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    loyaltyReward: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Trek = model<ITrek>('Trek', TrekSchema);

export default Trek;
