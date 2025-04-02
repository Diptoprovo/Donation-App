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
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register/donor', registerDonor);
router.post('/register/receiver', registerReceiver);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router; 