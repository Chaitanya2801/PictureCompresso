export const handleWebhook = async (req, res) => {
    try {
        const { request_id, status, output_image_urls } = req.body;

        // Log received webhook data
        console.log(`Webhook received for request ID: ${request_id}`);
        console.log(`Processing status: ${status}`);
        console.log(`Processed image URLs: ${output_image_urls}`);

        // Respond to the webhook sender
        res.status(200).json({ message: 'Webhook received successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
};
