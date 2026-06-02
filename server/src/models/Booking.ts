import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  trekId: Types.ObjectId;
  status: 'Pending' | 'Completed';
}

const BookingSchema = new Schema<IBooking>(
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
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
