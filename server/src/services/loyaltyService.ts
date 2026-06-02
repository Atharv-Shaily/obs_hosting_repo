import User from '../models/User';
import Trek from '../models/Trek';
import LoyaltyHistory from '../models/LoyaltyHistory';
import { Types } from 'mongoose';

type Rank =
  | 'L1 – Explorer'
  | 'L2 – Pahaadi Soul'
  | 'L3 – Summit Seeker'
  | 'L4 – Mountain Beast'
  | 'L5 – Oh-Bhaisahab Legend';

/**
 * Pure helper — derives rank from total loyalty points.
 * Tiering as specified:
 *   0   – 1000 : L1 – Explorer
 *   1001 – 2000 : L2 – Pahaadi Soul
 *   2001 – 3500 : L3 – Summit Seeker
 *   3501 – 6000 : L4 – Mountain Beast
 *   > 6000      : L5 – Oh-Bhaisahab Legend
 */
export const calculateRank = (totalPoints: number): Rank => {
  if (totalPoints <= 1000) return 'L1 – Explorer';
  if (totalPoints <= 2000) return 'L2 – Pahaadi Soul';
  if (totalPoints <= 3500) return 'L3 – Summit Seeker';
  if (totalPoints <= 6000) return 'L4 – Mountain Beast';
  return 'L5 – Oh-Bhaisahab Legend';
};

/**
 * Called when a booking transitions to "Completed".
 * 1. Fetches the trek's loyaltyReward.
 * 2. Adds points to the user and recalculates their rank.
 * 3. Logs the transaction to LoyaltyHistory.
 */
export const processCompletedTrek = async (
  userId: Types.ObjectId,
  trekId: Types.ObjectId
): Promise<void> => {
  const trek = await Trek.findById(trekId);
  if (!trek) throw new Error(`Trek ${trekId} not found.`);

  const user = await User.findById(userId);
  if (!user) throw new Error(`User ${userId} not found.`);

  const newTotal = user.loyaltyPoints + trek.loyaltyReward;
  const newRank = calculateRank(newTotal);

  user.loyaltyPoints = newTotal;
  user.rank = newRank;
  await user.save();

  await LoyaltyHistory.create({
    userId,
    trekId,
    pointsEarned: trek.loyaltyReward,
    transactionDate: new Date(),
  });
};
