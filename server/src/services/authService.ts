import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt.
 */
export const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, SALT_ROUNDS);
};

/**
 * Compares a plain-text password against a stored bcrypt hash.
 */
export const comparePassword = async (
  plainText: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};

/**
 * Signs a JWT containing the user's id and email.
 * Token expires in 7 days.
 */
export const signToken = (userId: Types.ObjectId, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined.');

  return jwt.sign({ id: userId.toString(), email }, secret, {
    expiresIn: '7d',
  });
};
