// src/components/UploadForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css'; // Import the CSS file for styling

const UploadForm = () => {
  const [file, setFile] = useState(null);         // Holds the selected file
  const [requestId, setRequestId] = useState(''); // Holds the request ID after uploading
  const [status, setStatus] = useState('');       // Holds the status message

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file); // Append file to form data

    try {
      setStatus('Uploading...');
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Extract request_id from the server response
      const uploadedRequestId = response.data.request_id; // The correct field from your response
      setRequestId(uploadedRequestId);  // Set request ID
      setStatus('Upload successful!');  // Update status to show successful upload

    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" accept=".csv" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>

      {/* Show the status message */}
      {status && <p>{status}</p>}

      {/* Show the request ID after upload */}
      {requestId && (
        <p>
          Request ID: <strong>{requestId}</strong>
        </p>
      )}
    </div>
  );
};

export default UploadForm;
