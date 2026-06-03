import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { hashPassword, comparePassword, signToken } from '../services/authService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email: email.toLowerCase(), passwordHash });

    const token = signToken(user._id, user.email);

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        rank: user.rank,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error });
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
    res.status(500).json({ message: 'Server error during login.', error });
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
      // since they'll never log in via password
      const placeholderHash = await hashPassword(crypto.randomUUID());
      user = await User.create({ email, passwordHash: placeholderHash });
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
    res.status(500).json({ message: 'Server error during Google login.', error });
  }
};
