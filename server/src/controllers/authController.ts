import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword, signToken } from '../services/authService';

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
