import React, { useState, useEffect } from 'react';
import UploadForm from './components/uploadForm';
import StatusCheck from './components/statusCheck';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [processingStatus, setProcessingStatus] = useState(null);
  const [processedImages, setProcessedImages] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Adjust the URL based on your backend

    socket.on('webhook_received', (data) => {
      console.log('Webhook Data Received:', JSON.stringify(data)); // Log the data

      let parsedRecords = [];
      if (data.processed_records) {
        try {
          parsedRecords = JSON.parse(data.processed_records); // Parse stringified processed_records
        } catch (error) {
          console.error('Failed to parse processed_records:', error);
        }
      }

      setProcessingStatus(data.status);
      setProcessedImages(parsedRecords); // Set parsed records directly
      setAlertVisible(true);
      setAlertMessage(`Webhook received: ${data.status}`);

      // Automatically hide the alert after a few seconds
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
    });

    return () => socket.disconnect();
  }, []);

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleDownload = (imageUrl) => {
    // Open the image URL in a new tab
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PictureCompresso</h1>
        <p>Upload your CSV file to process images!</p>
      </header>
      <main className="main-container">
        <div className="form-status-container">
          <div className="form-container">
            <UploadForm />
          </div>
          <div className="status-container">
            <StatusCheck processedImages={processedImages} />
          </div>
        </div>
        {alertVisible && (
          <div className="alert alert-info drop-down" role="alert">
            {alertMessage}
            <button type="button" className="close" aria-label="Close" onClick={handleCloseAlert}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        {processingStatus && (
          <p className="processing-status">Processing status: {processingStatus}</p>
        )}
        {/* Render download links for processed images */}
        {processedImages.length > 0 && (
          <div className="download-links">
            <h2>Download Compressed Images</h2>
            <ul>
              {processedImages.map((record, index) =>
                Array.isArray(record.outputImageUrls) &&
                record.outputImageUrls.map((imageUrl, imgIndex) => (
                  <li key={`${index}-${imgIndex}`}>
                    <button onClick={() => handleDownload(imageUrl)}>
                      Compressed Image {imgIndex + 1} (Product: {record.productName})
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
