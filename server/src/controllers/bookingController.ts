import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Booking from '../models/Booking';
import { processCompletedTrek } from '../services/loyaltyService';

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
 * Updates a booking's status. Triggers loyalty processing when set to "Completed".
 * Body: { status: 'Pending' | 'Completed' }
 */
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: 'Pending' | 'Completed' };

    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      res.status(400).json({ message: "Status must be 'Pending', 'Completed', or 'Cancelled'." });
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

    const wasAlreadyCompleted = booking.status === 'Completed';
    booking.status = status;
    await booking.save();

    // Award loyalty points only on first completion (not when cancelling)
    if (status === 'Completed' && !wasAlreadyCompleted) {
      await processCompletedTrek(booking.userId, booking.trekId);
    }

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
