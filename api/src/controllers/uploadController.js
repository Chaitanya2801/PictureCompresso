import { v4 as uuidv4 } from 'uuid';
import RequestModel from '../models/requestModel.js';
import { processImages } from '../utils/imageProcessor.js'; // For processing images
import parseCSV from '../utils/csvParser.js'; // CSV parsing utility
import fetch from 'node-fetch';
import Logger from '../utils/logger.js';

export const uploadCSV = async (req, res) => {
    const request_id = uuidv4(); // Generate unique request ID
    const outputResults = []; // To store processing results for each record

    try {
        const filePath = req.file.path; // Read CSV file path
        const records = await parseCSV(filePath); // Parse the CSV

        Logger.info(`Parsed ${records.length} records from CSV`);

        // Iterate over records and process each product entry
        for (const record of records) {
            const { "S. No.": serialNumber, "Product Name": productName, "Input Image Urls": InputImageUrls } = record;
            const inputImageUrls = InputImageUrls.split(',').map(url => url.trim());

            try {
                // Store the request in the database
                const newRequest = await RequestModel.createRequest({
                    request_id,
                    serial_number: parseInt(serialNumber), // Ensure integer
                    product_name: productName,
                    input_image_urls: JSON.stringify(inputImageUrls), // Store input image URLs as JSON
                    output_image_urls: JSON.stringify([]), // Initialize with empty array
                    status: 'processing' // Set status to 'processing'
                });
                Logger.info(`Created request for serial number: ${serialNumber}`);

                // Process the images (compress them)
                const outputImageUrls = await processImages(inputImageUrls);
                Logger.info("Output image urls: " + JSON.stringify(outputImageUrls));

                // Update the request with both input and output image URLs
                await RequestModel.updateRequest(newRequest.request_id, {
                    input_image_urls: inputImageUrls,
                    output_image_urls: outputImageUrls // Update output image URLs
                });

                outputResults.push({
                    serialNumber,
                    productName,
                    status: 'completed',
                    outputImageUrls
                });

            } catch (err) {
                Logger.error(`Error processing record for serial number: ${serialNumber}`, err);

                // Update request status to 'failed' in case of an error
                await RequestModel.updateRequest(request_id, {
                    status: 'failed'
                });

                outputResults.push({
                    serialNumber,
                    productName,
                    status: 'failed',
                    error: err.message
                });
            }
        }

        // Send the webhook after processing all images
        const webhookUrl = 'https://7de9-122-161-49-30.ngrok-free.app/api/webhook';

        try {
            const webhookPayload = {
                request_id,
                status: 'completed',  // Overall status
                processed_records: outputResults // Send the results of the processing
            };

            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
            });

            Logger.info('Webhook sent successfully');

        } catch (webhookError) {
            Logger.error('Error sending webhook:', webhookError);
        }

        // Respond to the client with the request ID
        res.status(201).json({ message: 'CSV uploaded and processed successfully', request_id });

    } catch (error) {
        // Global error handling
        Logger.error('Error uploading and processing CSV:', error);

        // In case of an error in processing the whole CSV, we update the request status as 'failed'
        await RequestModel.updateRequest(request_id, { status: 'failed' });

        res.status(500).json({ message: 'Error uploading and processing CSV', error: error.message });
    }
};
