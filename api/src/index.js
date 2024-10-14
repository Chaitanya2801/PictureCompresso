import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';
import statusRouter from './routes/status.js';
import webhookRouter from './routes/webhook.js';
import Logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the path to the uploads folder
console.log('Uploads path:', path.join(__dirname, '..', 'uploads')); // Add this line

// Serve the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Use the upload route
app.use('/api/upload', uploadRouter);

// Use the status route
app.use('/api/status', statusRouter);

// Use the webhook route
app.use('/api/webhook', webhookRouter);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to PictureCompresso!');
});

// Start server
app.listen(PORT, () => {
    Logger.info(`Server is running on http://localhost:${PORT}`);
});
