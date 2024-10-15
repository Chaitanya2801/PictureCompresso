import Logger from '../utils/logger.js';

export const handleWebhook = async (req, res) => {
    try {
        const { request_id, status, processed_records } = req.body;

        Logger.info(`Webhook received for request_id: ${request_id} with status: ${status}`);

        // Emit the 'webhook_received' event via socket.io
        if (req.io) {
            req.io.emit('webhook_received', {
                request_id,
                status,
                processed_records, // Send processed images back to the client
            });
            Logger.info('Webhook event emitted via socket.io');
        } else {
            Logger.error('Socket.io instance not found on req object');
        }

        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        Logger.error('Error processing webhook:', error);
        res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
};
