import express from 'express';
import {
    registerDonor,
    registerReceiver,
    login,
    googleAuth,
    logout,
    getProfile,
    updateProfile
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register/donor', registerDonor);
authRouter.post('/register/receiver', registerReceiver);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Protected routes
authRouter.get('/profile', authenticateUser, getProfile);
authRouter.put('/profile', authenticateUser, updateProfile);

export default authRouter; 