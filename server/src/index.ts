import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRouter from './routes/authRoutes';
import bookingRouter from './routes/bookingRoutes';
import userRouter from './routes/userRoutes';
import paymentRouter from './routes/paymentRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
// Security HTTP headers: X-Frame-Options, X-Content-Type-Options, HSTS, etc.
app.use(helmet());

// Restrict CORS to the configured frontend origin only — never allow wildcard in production.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// Limit request body size to 10kb to prevent denial-of-service via large payloads.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'OBS Backend is running.' });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/users', userRouter);
app.use('/api/payments', paymentRouter);

// ── Bootstrap ───────────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();

export default app;
