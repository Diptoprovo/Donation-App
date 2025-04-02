import express from 'express';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { getDonorItems } from '../controllers/itemController.js';
import { getDonorTransactions } from '../controllers/transactionController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateUser, authorizeRole('donor'));

// Get donor's items
router.get('/items', getDonorItems);

// Get donor's transactions
router.get('/transactions', getDonorTransactions);


export default router; 