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
  } catch (error) {
    res.status(500).json({ message: 'Server error creating booking.', error });
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

    if (!['Pending', 'Completed'].includes(status)) {
      res.status(400).json({ message: "Status must be 'Pending' or 'Completed'." });
      return;
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found.' });
      return;
    }

    const wasAlreadyCompleted = booking.status === 'Completed';
    booking.status = status;
    await booking.save();

    // Award loyalty points only on first completion
    if (status === 'Completed' && !wasAlreadyCompleted) {
      await processCompletedTrek(booking.userId, booking.trekId);
    }

    res.status(200).json({ message: 'Booking status updated.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating booking status.', error });
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
    res.status(500).json({ message: 'Server error fetching bookings.', error });
  }
};
