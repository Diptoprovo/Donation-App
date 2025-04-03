import express from 'express';
import {
    updateTransactionStatus,
    getTransactionById,
    initiateItemDonation,
    initiateTransaction,
    approveOrRejectRequest,
    // approveRequest,
    // rejectRequest,
    // requestCategory
} from '../controllers/transactionController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';

const transactionRouter = express.Router();

// Apply authentication to all routes
transactionRouter.use(authenticateUser);

// Get a specific transaction (both donor and receiver can access)
transactionRouter.get('/:id', getTransactionById);

// Request a specific item (receiver only)
// transactionRouter.post('/request-item', authorizeRole('receiver'), requestCategory);
// For this functionality, call the creqate request from frontend instead of crowding the transaction routes

//Receiver requests a listed product
transactionRouter.post('/new', authenticateUser, authorizeRole('receiver'), initiateTransaction);

//Donor accpets or rejects a request
transactionRouter.put('/donor-update', authenticateUser, authorizeRole('Donor'), approveOrRejectRequest);

// Update transaction status (admin only)
transactionRouter.put('/:id/status', authenticateAdmin, updateTransactionStatus);

// Donor initiates donation for a specific request (donor only)
transactionRouter.post('/donate', authorizeRole('donor'), initiateItemDonation);


export default transactionRouter; 