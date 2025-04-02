import express from 'express';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { getReceiverRequests } from '../controllers/requestController.js';
import { getReceiverTransactions } from '../controllers/transactionController.js';
// import { getMatchingItems } from '../controllers/itemController.js';

const receiverRouter = express.Router();

// Apply auth middleware to all routes
receiverRouter.use(authenticateUser, authorizeRole('receiver'));

// Get receiver's requests
receiverRouter.get('/requests', getReceiverRequests);

// Get receiver's transactions
receiverRouter.get('/transactions', getReceiverTransactions);

// Get items matching receiver's requests
// receiverRouter.get('/matching-items', getMatchingItems);

export default receiverRouter; 