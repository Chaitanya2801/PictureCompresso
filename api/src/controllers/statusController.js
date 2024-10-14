import RequestModel from '../models/requestModel.js';
import Logger from '../utils/logger.js';

export const getStatus = async (req, res) => {
    const { requestId } = req.params;

    try {
        // Find the request in the database using the requestId
        const request = await RequestModel.getRequestById(requestId);
    
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
    
        // Prepare response
        const response = {
            requestId: request.request_id,
            status: request.status,
            processedImages: request.status === 'completed' ? request.processed_images : [],
        };
    
        // Log the response to check for formatting
        Logger.info('Response:', JSON.stringify(response, null, 2)); // Pretty print the response
    
        // Send the response
        return res.json(response);
    
    } catch (error) {
        Logger.error('Error fetching request status:', error);
        return res.status(500).json({ message: 'Server error while fetching request status' });
    }
    
};
