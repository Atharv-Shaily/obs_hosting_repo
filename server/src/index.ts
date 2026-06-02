import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRouter from './routes/authRoutes';
import bookingRouter from './routes/bookingRoutes';
import userRouter from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'OBS Backend is running.' });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/users', userRouter);

// ── Bootstrap ───────────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();

export default app;
