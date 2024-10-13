import Logger from '../utils/logger.js';

export const handleWebhook = async (req, res) => {
    try {
        const { request_id, status, output_image_urls } = req.body;

        // Log received webhook data
        Logger.info(`Webhook received for request ID: ${request_id}`);
        Logger.info(`Processing status: ${status}`);
        Logger.info(`Processed image URLs: ${output_image_urls}`);

        // Respond to the webhook sender
        res.status(200).json({ message: 'Webhook received successfully' });
    } catch (error) {
        Logger.error('Error processing webhook:', error);
        res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
};
