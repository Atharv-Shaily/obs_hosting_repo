import { Schema, model, Document } from 'mongoose';

/**
 * Pricing subdocument stored in MongoDB.
 * null means the payment option does not exist for this trek.
 * Non-null values are the authoritative server-side prices used
 * for PayU hash generation — never trust the client's amount.
 */
export interface ITrekPricing {
  registrationFee:                 number;        // always required
  paymentDeadline:                 string;        // always required
  totalCostWithTransport:          number | null; // null = transport option unavailable
  remainingAmountWithTransport:    number | null;
  totalCostWithoutTransport:       number | null; // null = without-transport option unavailable
  remainingAmountWithoutTransport: number | null;
  originalPrice:                   number | null; // null = no strikethrough discount
}

export interface ITrek extends Document {
  title: string;
  description: string;
  loyaltyReward: number;
  pricing: ITrekPricing | null; // null for auto-created / unseeded treks
}

const TrekPricingSchema = new Schema<ITrekPricing>(
  {
    registrationFee:                 { type: Number, required: true },
    paymentDeadline:                 { type: String, required: true },
    totalCostWithTransport:          { type: Number, default: null },
    remainingAmountWithTransport:    { type: Number, default: null },
    totalCostWithoutTransport:       { type: Number, default: null },
    remainingAmountWithoutTransport: { type: Number, default: null },
    originalPrice:                   { type: Number, default: null },
  },
  { _id: false } // subdocument — no separate _id needed
);

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
    pricing: {
      type: TrekPricingSchema,
      default: null,
    },
  },
  { timestamps: true }
);

const Trek = model<ITrek>('Trek', TrekSchema);

export default Trek;

