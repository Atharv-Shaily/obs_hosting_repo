import mongoose from 'mongoose';
import Booking from '../models/Booking';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log('MongoDB connected.');

    // Sync schema indexes to the database.
    // Wrapped in its own try/catch so a sync failure never crashes the server.
    try {
      await Booking.syncIndexes();
      console.log('Booking indexes synced.');
    } catch (indexErr) {
      console.warn('Warning: Booking index sync failed (server will still run):', indexErr);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
