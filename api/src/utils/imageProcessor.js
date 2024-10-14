import sharp from 'sharp'; // For image processing
import axios from 'axios'; // To download images
import fs from 'fs';
import path from 'path';
// import RequestModel from '../models/requestModel.js'; // Import the Request model for updates

export const processImages = async (inputImageUrls) => {
    const outputImageUrls = [];

    try {
        // Process each image URL by downloading, compressing, and saving the output
        for (const url of inputImageUrls) {
            const imagePath = path.join('uploads', path.basename(url)); // Path to save the downloaded image
            
            // Download the image
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, response.data); // Save the image locally

            // Now process the image with sharp
            const outputBuffer = await sharp(imagePath)
                .resize({ width: 800 }) // Resize image
                .jpeg({ quality: 50 }) // Compress image
                .toBuffer();

            const outputFileName = `compressed-${path.basename(url)}`; // Use the basename of the input URL
            const outputPath = path.join('uploads', outputFileName);
            await sharp(outputBuffer).toFile(outputPath);

            // Generate the public URL for the image
            const outputImageUrl = `http://localhost:3000/uploads/${outputFileName}`;
            outputImageUrls.push(outputImageUrl); // Store the public URL of the compressed image
        }

        console.log("Output image urls: " + JSON.stringify(outputImageUrls));
        return outputImageUrls; // Return the processed output image URLs

    } catch (error) {
        console.error('Error processing images:', error);
        throw error; // Rethrow error for handling in the calling function
    }
};
