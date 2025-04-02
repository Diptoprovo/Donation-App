import express from 'express';
import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from '../controllers/requestController.js';
import { verifyToken, isReceiver } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:id', getRequestById);

// Admin route (for future use)
router.get('/', getAllRequests);

// Protected routes (receiver only)
router.post('/', verifyToken, isReceiver, createRequest);
router.put('/:id', verifyToken, isReceiver, updateRequest);
router.delete('/:id', verifyToken, isReceiver, deleteRequest);

export default router; 