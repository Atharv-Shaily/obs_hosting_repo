import { Router } from 'express';
import { register, login, googleLogin } from '../controllers/authController';

const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', register);

// POST /api/auth/login
authRouter.post('/login', login);

// POST /api/auth/google
authRouter.post('/google', googleLogin);

export default authRouter;
