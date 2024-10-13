import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';
import statusRouter from './routes/status.js';
import webhookRouter from './routes/webhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    console.log(`Server is running on http://localhost:${PORT}`);
});
