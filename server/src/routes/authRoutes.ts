import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, googleLogin, verifyOtp, resendOtp } from '../controllers/authController';

const authRouter = Router();

// ── Rate Limiters ─────────────────────────────────────────────────────────────
// General auth limiter: max 20 attempts per 15 minutes per IP.
// Covers register, login, verify-otp, and google sign-in.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' },
});

// Tighter limiter for resend-OTP to prevent email spam abuse: max 5 per 15 minutes.
const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many OTP resend requests. Please try again after 15 minutes.' },
});

// POST /api/auth/register
authRouter.post('/register', authLimiter, register);

// POST /api/auth/login
authRouter.post('/login', authLimiter, login);

// POST /api/auth/verify-otp
authRouter.post('/verify-otp', authLimiter, verifyOtp);

// POST /api/auth/resend-otp
authRouter.post('/resend-otp', resendOtpLimiter, resendOtp);

// POST /api/auth/google
authRouter.post('/google', authLimiter, googleLogin);

export default authRouter;
