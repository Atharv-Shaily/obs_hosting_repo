import { Router } from 'express';
import authGuard from '../middlewares/authGuard';
import { getProfile, getLoyaltyHistory } from '../controllers/userController';

const userRouter = Router();

// All user routes require a valid JWT
userRouter.use(authGuard);

// GET /api/users/profile         — current profile, points, rank
userRouter.get('/profile', getProfile);

// GET /api/users/loyalty-history — full history populated with Trek names
userRouter.get('/loyalty-history', getLoyaltyHistory);

export default userRouter;
