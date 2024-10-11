import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import RequestModel from '../models/requestModel.js';
import { processImages } from '../utils/imageProcessor.js'; // For processing images
import parseCSV from '../utils/csvParser.js'; // CSV parsing utility

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Multer to handle file uploads

// Upload API
router.post('/', upload.single('csv'), async (req, res) => {
    try {
        const request_id = uuidv4(); // Generate unique request ID
        const filePath = req.file.path; // Read CSV file path
        const records = await parseCSV(filePath); // Parse the CSV

        // Log the number of records
        console.log(`Parsed ${records.length} records from CSV`);

        // Step 3: Iterate over records and process each product entry
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

                console.log(`Created request for serial number: ${serialNumber}`);

                // Process the images (compress them)
                const outputImageUrls = await processImages(inputImageUrls);

                // Update the request with output image URLs
                await RequestModel.updateRequest(newRequest.request_id, {
                    output_image_urls: JSON.stringify(outputImageUrls), // Update output image URLs
                    status: 'completed' // Update status to 'completed'
                });

            } catch (err) {
                console.error(`Error processing record for serial number: ${serialNumber}`, err);
            }
        }

        // Step 4: Respond to the client with the request ID
        res.status(201).json({ message: 'CSV uploaded and processed successfully', request_id });

    } catch (error) {
        console.error('Error uploading and processing CSV:', error);
        res.status(500).json({ message: 'Error uploading and processing CSV', error: error.message });
    }
});

export default router;
