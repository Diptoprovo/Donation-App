import express from 'express';
import {
    updateTransactionStatus,
    getTransactionById,
    initiateItemDonation,
    approveRequest,
} from '../controllers/transactionController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';

const transactionRouter = express.Router();

// Apply authentication to all routes
transactionRouter.use(authenticateUser);

// Get a specific transaction (both donor and receiver can access)
transactionRouter.get('/:id', getTransactionById);

// Request an item (receiver only)
// transactionRouter.post('/request', authorizeRole('receiver'), requestItem);

// Update transaction status (donor only)
transactionRouter.put('/:id/status', authorizeRole('donor'), updateTransactionStatus);

// Donor initiates donation for a specific request (donor only)
transactionRouter.post('/donate', authorizeRole('donor'), initiateItemDonation);

// Approve a specific request (donor only)
transactionRouter.post('/requests/:requestId/approve', authorizeRole('donor'), approveRequest);

export default transactionRouter; 