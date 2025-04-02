import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/itemController.js';
import { authenticateUser, isDonor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const itemRouter = express.Router();

// Public routes
itemRouter.get('/', getAllItems);
itemRouter.get('/item', authenticateUser, getItemById);

// Protected routes (donor only)
itemRouter.post('/create-item', authenticateUser, isDonor, upload.array('images', 5), createItem);
itemRouter.put('/update-item', authenticateUser, isDonor, upload.array('images', 5), updateItem);
itemRouter.delete('/delete-item', authenticateUser, isDonor, deleteItem);

export default itemRouter; 