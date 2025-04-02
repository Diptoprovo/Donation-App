import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/itemController.js';
import { verifyToken, isDonor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Protected routes (donor only)
router.post('/', verifyToken, isDonor, upload.array('images', 5), createItem);
router.put('/:id', verifyToken, isDonor, upload.array('images', 5), updateItem);
router.delete('/:id', verifyToken, isDonor, deleteItem);

export default router; 