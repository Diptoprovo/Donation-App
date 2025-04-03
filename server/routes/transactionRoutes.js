import express from 'express';
import {
    updateTransactionStatus,
    getTransactionById,
    initiateItemDonation,
    approveRequest,
    rejectRequest,
    requestCategory
} from '../controllers/transactionController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';

const transactionRouter = express.Router();

// Apply authentication to all routes
transactionRouter.use(authenticateUser);

// Get a specific transaction (both donor and receiver can access)
transactionRouter.get('/:id', getTransactionById);

// Request a specific item (receiver only)
transactionRouter.post('/request-item', authorizeRole('receiver'), requestCategory);

// Update transaction status (admin only)
transactionRouter.put('/:id/status', authenticateAdmin, updateTransactionStatus);

// Donor initiates donation for a specific request (donor only)
transactionRouter.post('/donate', authorizeRole('donor'), initiateItemDonation);

// Approve a specific request (donor only)
transactionRouter.post('/requests/:requestId/approve', authorizeRole('donor'), approveRequest);

// Reject a specific request (donor only)
transactionRouter.post('/requests/:requestId/reject', authorizeRole('donor'), rejectRequest);

export default transactionRouter; 