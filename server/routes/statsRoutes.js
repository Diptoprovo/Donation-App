import express from 'express';
import { getStats } from '../controllers/statsController.js';

const statsRouter = express.Router();

// Public route to get overall statistics
statsRouter.get('/', getStats);

export default statsRouter; 