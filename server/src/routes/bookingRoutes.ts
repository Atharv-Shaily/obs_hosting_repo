import { Router } from 'express';
import authGuard from '../middlewares/authGuard';
import {
  createBooking,
  updateBookingStatus,
  getMyBookings,
} from '../controllers/bookingController';

const bookingRouter = Router();

// All booking routes require a valid JWT
bookingRouter.use(authGuard);

// POST   /api/bookings        — create a new booking
bookingRouter.post('/', createBooking);

// GET    /api/bookings/my     — list the authenticated user's bookings
bookingRouter.get('/my', getMyBookings);

// PATCH  /api/bookings/:id/status — update booking status (triggers loyalty on Completed)
bookingRouter.patch('/:id/status', updateBookingStatus);

export default bookingRouter;
