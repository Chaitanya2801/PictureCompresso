import fs from 'fs';
import csv from 'csv-parser';

// Function to parse CSV file
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        // Create a readable stream from the file path
        fs.createReadStream(filePath)
            .pipe(csv()) // Use csv-parser to parse the CSV file
            .on('data', (data) => {
                // Push each record to the results array
                results.push(data);
            })
            .on('end', () => {
                // Resolve the promise with the parsed data
                resolve(results);
            })
            .on('error', (error) => {
                // Reject the promise in case of an error
                reject(error);
            });
    });
};

export default parseCSV;
