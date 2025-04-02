import express from 'express';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { getReceiverRequests } from '../controllers/requestController.js';
import { getReceiverTransactions } from '../controllers/transactionController.js';
import { getMatchingItems } from '../controllers/itemController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateUser, authorizeRole('receiver'));

// Get receiver's requests
router.get('/requests', getReceiverRequests);

// Get receiver's transactions
router.get('/transactions', getReceiverTransactions);

// Get items matching receiver's requests
router.get('/matching-items', getMatchingItems);

export default router; 