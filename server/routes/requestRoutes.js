import express from 'express';
import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from '../controllers/requestController.js';
import { authenticateUser, isDonor, isReceiver } from '../middleware/authMiddleware.js';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';
const requestRouter = express.Router();

// Public routes
requestRouter.get('/get-request-by-id', getRequestById);

// Donor route (for future use)
requestRouter.get('/get-all-requests', authenticateUser, isDonor, getAllRequests);

// Protected routes (receiver only)
requestRouter.post('/create-request', authenticateUser, isReceiver, createRequest);
requestRouter.put('/update-request', authenticateUser, isReceiver, updateRequest);
requestRouter.delete('/delete-request', authenticateUser, isReceiver, deleteRequest);

export default requestRouter; 