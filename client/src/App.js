import React from 'react';
import UploadForm from './components/uploadForm';
import StatusCheck from './components/statusCheck';
import './App.css'; // Make sure to link the CSS file

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PictureCompresso</h1>
        <p>Upload your CSV file to process images!</p>
      </header>
      <main className="main-container">
        <div className="form-container">
          <UploadForm />
        </div>
        <div className="status-container">
          <StatusCheck />
        </div>
      </main>
    </div>
  );
}

export default App;
