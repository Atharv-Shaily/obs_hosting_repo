import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import validator from 'validator';
import User from '../models/User';
import { hashPassword, comparePassword, signToken } from '../services/authService';
import { sendVerificationEmail } from '../services/emailService';
import crypto from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      res.status(400).json({ message: 'Please provide a valid email address.' });
      return;
    }

    // Enforce password length: minimum 8, maximum 128 characters
    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      return;
    }
    if (password.length > 128) {
      res.status(400).json({ message: 'Password must not exceed 128 characters.' });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      if (user.isVerified) {
        res.status(409).json({ message: 'An account with this email already exists.' });
        return;
      }
      // If user exists but isn't verified, we'll update their password and send a new OTP.
    }

    const passwordHash = await hashPassword(password);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (!user) {
      user = await User.create({ 
        email: email.toLowerCase(), 
        passwordHash,
        otp,
        otpExpires,
        isVerified: false
      });
    } else {
      user.passwordHash = passwordHash;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    await sendVerificationEmail(user.email, otp);

    res.status(201).json({
      message: 'Registration successful. OTP sent to email.',
      requiresOtp: true,
      email: user.email
    });
  } catch (error) {
    console.error('[register]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    if (!user.isVerified) {
      // Send a new OTP automatically on failed unverified login
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      await sendVerificationEmail(user.email, otp);

      res.status(403).json({ 
        message: 'Email not verified. A new OTP has been sent.',
        requiresOtp: true,
        email: user.email
      });
      return;
    }

    const token = signToken(user._id, user.email);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        rank: user.rank,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (error) {
    console.error('[login]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'User is already verified.' });
      return;
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP.' });
      return;
    }

    // OTP is valid
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = signToken(user._id, user.email);

    res.status(200).json({
      message: 'Verification successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        rank: user.rank,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (error) {
    console.error('[verifyOtp]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 */
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };

    if (!email) {
      res.status(400).json({ message: 'Email is required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      res.status(200).json({ message: 'If an account exists, an OTP has been sent.' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'User is already verified.' });
      return;
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, otp);

    res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (error) {
    console.error('[resendOtp]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * POST /api/auth/google
 * Body: { credential } — the Google ID token from the frontend
 * Verifies the token, finds or creates the user, and returns a JWT.
 */
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body as { credential: string };

    if (!credential) {
      res.status(400).json({ message: 'Google credential is required.' });
      return;
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(401).json({ message: 'Invalid Google token.' });
      return;
    }

    const email = payload.email.toLowerCase();

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create account for Google user — use a random hash as placeholder
      const placeholderHash = await hashPassword(crypto.randomUUID());
      user = await User.create({ 
        email, 
        passwordHash: placeholderHash,
        isVerified: true // Google accounts are implicitly verified
      });
    } else if (!user.isVerified) {
      // If they registered with email previously but didn't verify, and now logged in with Google, mark as verified
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
    }

    const token = signToken(user._id, user.email);

    res.status(200).json({
      message: 'Google login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        rank: user.rank,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (error) {
    console.error('[googleLogin]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
