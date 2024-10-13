import express from 'express';
import { getStatus } from '../controllers/statusController.js';

const router = express.Router();

router.get('/:requestId', getStatus);

export default router;
