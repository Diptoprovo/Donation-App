import express from 'express';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { getReceiverRequests } from '../controllers/requestController.js';
import { getReceiverTransactions } from '../controllers/transactionController.js';
import { getAvailableItems } from '../controllers/itemController.js';
import { getAllXY } from '../controllers/XYController.js';
// import { getMatchingItems } from '../controllers/itemController.js';

const receiverRouter = express.Router();

// Apply auth middleware to all routes
receiverRouter.use(authenticateUser, authorizeRole('receiver'));

// Get receiver's requests
receiverRouter.get('/requests', getReceiverRequests);

// Get receiver's transactions
receiverRouter.get('/transactions', getReceiverTransactions);

// Get all available items for request
receiverRouter.get('/available-items', getAvailableItems);
// Get all receiver x-y from database
receiverRouter.get('/x-y', getAllXY);

export default receiverRouter; 