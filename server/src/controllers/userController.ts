import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import LoyaltyHistory from '../models/LoyaltyHistory';

/**
 * GET /api/users/profile
 * Returns the authenticated user's profile, loyalty points, and rank.
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user!.id);

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        rank: user.rank,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[getProfile]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * GET /api/users/loyalty-history
 * Returns the authenticated user's full LoyaltyHistory,
 * with each entry's trekId populated with the Trek's title and loyaltyReward.
 */
export const getLoyaltyHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user!.id);

    const history = await LoyaltyHistory.find({ userId })
      .populate('trekId', 'title loyaltyReward')
      .sort({ transactionDate: -1 });

    res.status(200).json({ history });
  } catch (error) {
    console.error('[getLoyaltyHistory]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
