import express from 'express';
import {
    updateTransactionStatus,
    getTransactionById,
    initiateItemDonation,
    initiateTransaction,
    approveOrRejectRequest,
} from '../controllers/transactionController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';

const transactionRouter = express.Router();

// Get a specific transaction (both donor and receiver can access)
transactionRouter.get('/:id', getTransactionById);

//Receiver requests a listed product
transactionRouter.post('/new', authenticateUser, authorizeRole('receiver'), initiateTransaction);

//Donor accpets or rejects a request
transactionRouter.put('/donor-update', authenticateUser, authorizeRole('donor'), approveOrRejectRequest);

// Update transaction status (admin only)
transactionRouter.put('/:id/status', authenticateAdmin, updateTransactionStatus);

// Donor initiates donation for a specific request (donor only)
transactionRouter.post('/donate', authenticateUser, authorizeRole('donor'), initiateItemDonation);


export default transactionRouter; 