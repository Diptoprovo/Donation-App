import express from 'express';
import {
    requestItem,
    updateTransactionStatus,
    getTransactionById,
    initiateItemDonation,
    approveRequest,
} from '../controllers/transactionController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// Get a specific transaction (both donor and receiver can access)
router.get('/:id', getTransactionById);

// Request an item (receiver only)
router.post('/request', authorizeRole('receiver'), requestItem);

// Update transaction status (donor only)
router.put('/:id/status', authorizeRole('donor'), updateTransactionStatus);

// Donor initiates donation for a specific request (donor only)
router.post('/donate', authorizeRole('donor'), initiateItemDonation);

// Approve a specific request (donor only)
router.post('/requests/:requestId/approve', authorizeRole('donor'), approveRequest);

export default router; 