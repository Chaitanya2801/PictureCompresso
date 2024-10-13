import RequestModel from '../models/requestModel.js';

export const getStatus = async (req, res) => {
    const { requestId } = req.params;

    try {
        // Find the request in the database using the requestId
        const request = await RequestModel.getRequestById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Send the request status and processed image URLs
        return res.json({
            requestId: request.request_id,
            status: request.status,
            processedImages: request.status === 'completed' ? request.output_image_urls : [],
        });

    } catch (error) {
        console.error('Error fetching request status:', error);
        return res.status(500).json({ message: 'Server error while fetching request status' });
    }
};
