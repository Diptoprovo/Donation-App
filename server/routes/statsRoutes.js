import express from 'express';
import { getStats } from '../controllers/statsController.js';
const statsRouter = express.Router();
import {getAllXY} from '../controllers/XYController.js';
// Public route to get overall statistics
statsRouter.get('/', getStats);
statsRouter.get('/xy', getAllXY);

export default statsRouter; 