import React from 'react';
import UploadForm from './components/uploadForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to PictureCompresso</h1>
        <p>Upload your CSV file to process images!</p>
      </header>
      <main>
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
