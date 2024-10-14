import React, { useState } from 'react';

function StatusCheck() {
    const [requestId, setRequestId] = useState('');
    const [status, setStatus] = useState(null);
    const [processedImages, setProcessedImages] = useState([]); // State to hold processed image URLs
    const [error, setError] = useState(null);

    const handleCheckStatus = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/status/${requestId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch status');
            }
            const data = await response.json();
            setStatus(data.status);

            // Directly set processedImages without parsing
            if (data.status === "completed") {
                setProcessedImages(data.processedImages); // Assuming processedImages is already an array
            } else {
                setProcessedImages([]); // Reset if not completed
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            setStatus(null);
            setProcessedImages([]); // Reset processed images on error
        }
    };

    return (
        <div>
            <h2>Check Processing Status</h2>
            <input 
                type="text" 
                value={requestId} 
                onChange={(e) => setRequestId(e.target.value)} 
                placeholder="Enter Request ID" 
            />
            <button onClick={handleCheckStatus}>Check Status</button>
            {status && <p>Status: {status}</p>}
            {error && <p>Error: {error}</p>}
            {status === "completed" && processedImages.length > 0 && (
                <div>
                    <h3>Processed Images:</h3>
                    <ul>
                        {processedImages.map((imageUrl, index) => (
                            <li key={index}>
                                <img src={imageUrl} alt={`Processed Image ${index + 1}`} style={{ width: '200px', height: 'auto' }} />
                                <p>{imageUrl}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default StatusCheck;
