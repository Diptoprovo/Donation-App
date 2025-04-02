import express from 'express';
import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from '../controllers/requestController.js';
import { authenticateUser, isReceiver } from '../middleware/authMiddleware.js';

const requestRouter = express.Router();

// Public routes
requestRouter.get('/', getRequestById);

// Admin route (for future use)
requestRouter.get('/', getAllRequests);

// Protected routes (receiver only)
requestRouter.post('/', authenticateUser, isReceiver, createRequest);
requestRouter.put('/', authenticateUser, isReceiver, updateRequest);
requestRouter.delete('/', authenticateUser, isReceiver, deleteRequest);

export default requestRouter; 