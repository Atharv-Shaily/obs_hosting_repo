import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Booking from '../models/Booking';

/**
 * POST /api/bookings
 * Creates a new booking for the authenticated user.
 * Body: { trekId }
 */
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user!.id);
    const { trekId } = req.body as { trekId: string };

    if (!trekId) {
      res.status(400).json({ message: 'trekId is required.' });
      return;
    }

    const booking = await Booking.create({
      userId,
      trekId: new Types.ObjectId(trekId),
      status: 'Pending',
    });

    res.status(201).json({ message: 'Booking created.', booking });
  } catch (error: any) {
    // MongoDB duplicate key error (index violation)
    if (error?.code === 11000) {
      res.status(409).json({ message: 'You already have an active booking for this trek.' });
      return;
    }
    console.error('[createBooking]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * PATCH /api/bookings/:id/status
 * Allows a user to cancel their own booking only.
 * Setting status to 'Completed' is NOT allowed here — only the PayU webhook
 * (payuCallback) may mark a booking as Completed after verifying payment hash.
 * Body: { status: 'Cancelled' }
 */
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: 'Cancelled' };

    // Users may only cancel their own bookings via this endpoint.
    // 'Completed' is reserved exclusively for the PayU payment webhook.
    if (!['Cancelled'].includes(status)) {
      res.status(403).json({ message: "You may only cancel a booking. Payment completion is handled automatically." });
      return;
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found.' });
      return;
    }

    // Ownership check — only the booking's owner may update its status.
    if (booking.userId.toString() !== req.user!.id) {
      res.status(403).json({ message: 'Forbidden: you do not own this booking.' });
      return;
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Booking status updated.', booking });
  } catch (error) {
    console.error('[updateBookingStatus]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * GET /api/bookings/my
 * Returns all bookings belonging to the authenticated user.
 */
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user!.id);

    const bookings = await Booking.find({ userId }).populate('trekId', 'title loyaltyReward');

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('[getMyBookings]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
