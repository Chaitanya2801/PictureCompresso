import pool from '../utils/db.js'; // Import the DB connection
import Logger from '../utils/logger.js';

// Function to create a new request entry
const createRequest = async (requestData) => {
    const { request_id, serial_number, product_name, input_image_urls, output_image_urls, status } = requestData;

    const query = `
        INSERT INTO requests (request_id, serial_number, product_name, input_image_urls, output_image_urls, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [request_id, serial_number, product_name, input_image_urls, output_image_urls, status];

    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Return the created record
    } catch (err) {
        throw new Error('Error creating request: ' + err.message);
    }
};

const updateRequest = async (request_id, updateData) => {
    const { input_image_urls, output_image_urls } = updateData;

    // Ensure the input and output URLs are properly formatted as JSON strings
    const inputUrlsString = JSON.stringify(input_image_urls);
    const outputUrlsString = JSON.stringify(output_image_urls);

    // SQL query to update the output_image_urls and status based on request_id and input_image_urls
    const query = `
        UPDATE requests
        SET output_image_urls = $1, status = 'completed'
        WHERE request_id = $2 AND input_image_urls = $3
        RETURNING *;
    `;

    // Prepare the values for the query
    const values = [
        outputUrlsString, // Update the output image URLs
        request_id,       // Condition based on request_id
        inputUrlsString   // Condition based on input_image_urls
    ];
    Logger.info("Updating values:" + values);

    try {
        const res = await pool.query(query, values);
        Logger.info("Values Updated" + JSON.stringify(res.rows[0]));
        return res.rows[0]; // Return the updated record
    } catch (err) {
        Logger.error("Error updating values:" + err.message);
    }
};

// Function to get all output_image_urls by request_id where status is completed
const getRequestById = async (request_id) => {
    const query = `
        SELECT 
            request_id, 
            status, 
            ARRAY_AGG(output_image_urls) AS processed_images
        FROM requests
        WHERE request_id = $1 AND status = 'completed'
        GROUP BY request_id, status;
    `;

    try {
        const res = await pool.query(query, [request_id]);
        
        if (res.rows.length > 0) {
            // Parse processed_images from string representation to actual array
            const processedImages = res.rows[0].processed_images.map(imageString => {
                return JSON.parse(imageString); // This converts the string to an array
            }).flat(); // Flatten the array in case of multiple entries
            
            return {
                ...res.rows[0],
                processed_images: processedImages // Update the property with parsed images
            };
        } else {
            return null; // Handle case where no rows are found
        }
    } catch (err) {
        throw new Error('Error fetching request: ' + err.message);
    }
};

// Export all functions as default object
export default {
    createRequest,
    updateRequest, // Changed function name to match upload.js
    getRequestById
};
