import pool from '../utils/db.js'; // Import the DB connection

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

// Function to update output image URLs and status
const updateRequest = async (request_id, updateData) => {
    const { output_image_urls, status } = updateData;

    const query = `
        UPDATE requests
        SET output_image_urls = $1, status = $2
        WHERE request_id = $3
        RETURNING *;
    `;

    const values = [output_image_urls, status, request_id];

    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Return the updated record
    } catch (err) {
        throw new Error('Error updating request: ' + err.message);
    }
};

// Function to get request by request_id
const getRequestById = async (request_id) => {
    const query = `
        SELECT * FROM requests
        WHERE request_id = $1;
    `;

    try {
        const res = await pool.query(query, [request_id]);
        return res.rows[0]; // Return the found record
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
