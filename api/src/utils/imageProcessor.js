import sharp from 'sharp'; // For image processing
import axios from 'axios'; // To download images
import fs from 'fs';
import path from 'path';
import Logger from '../utils/logger.js';

export const processImages = async (inputImageUrls) => {
    const outputImageUrls = [];

    try {
        // Process each image URL by downloading, compressing, and saving the output
        for (const url of inputImageUrls) {
            const imageName = path.basename(url);
            const imagePath = path.join('uploads', imageName); // Path to save the downloaded image
            
            // Check if the image already exists in the uploads folder
            if (fs.existsSync(imagePath)) {
                Logger.info(`Image already exists: ${imagePath}. Skipping processing.`);
                // Optionally, you can return the existing URL
                const existingImageUrl = `http://localhost:3000/uploads/${imageName}`;
                outputImageUrls.push(existingImageUrl);
                continue; // Skip to the next image URL
            }

            // Download the image
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, response.data); // Save the image locally

            // Now process the image with sharp
            const outputBuffer = await sharp(imagePath)
                .resize({ width: 800 }) // Resize image
                .jpeg({ quality: 50 }) // Compress image
                .toBuffer();

            const outputFileName = `compressed-${imageName}`; // Use the basename of the input URL
            const outputPath = path.join('uploads', outputFileName);
            await sharp(outputBuffer).toFile(outputPath);

            // Generate the public URL for the image
            const outputImageUrl = `http://localhost:3000/uploads/${outputFileName}`;
            outputImageUrls.push(outputImageUrl); // Store the public URL of the compressed image
        }

        Logger.info("Output image urls: " + JSON.stringify(outputImageUrls));
        return outputImageUrls; // Return the processed output image URLs

    } catch (error) {
        Logger.error('Error processing images:', error);
        throw error; // Rethrow error for handling in the calling function
    }
};
