import { Router } from 'express';
import { register, login } from '../controllers/authController';

const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', register);

// POST /api/auth/login
authRouter.post('/login', login);

export default authRouter;
