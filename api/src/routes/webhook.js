import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook endpoint to receive notifications after image processing
router.post('/', handleWebhook);

export default router;
