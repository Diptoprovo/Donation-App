import express from 'express';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { getDonorItems } from '../controllers/itemController.js';
import { getDonorTransactions } from '../controllers/transactionController.js';
import {getAllXY} from '../controllers/XYController.js';

const donorRouter = express.Router();

// Apply auth middleware to all routes
donorRouter.use(authenticateUser, authorizeRole('donor'));

// Get donor's items
donorRouter.get('/items', getDonorItems);

// Get donor's transactions
donorRouter.get('/transactions', getDonorTransactions);

donorRouter.get('/x-y', getAllXY);


export default donorRouter; 