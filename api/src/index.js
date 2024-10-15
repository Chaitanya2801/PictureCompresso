import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';
import statusRouter from './routes/status.js';
import webhookRouter from './routes/webhook.js';
import Logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // Ensure this matches your frontend's origin
        methods: ["GET", "POST"],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    Logger.info('A user connected');
    // Handle any events from the client here
});

// Make the `io` instance available to routes
app.use((req, res, next) => {
  req.io = io; // Attach `io` to `req` object
  next();
});

// Log the path to the uploads folder
Logger.info('Uploads path:', path.join(__dirname, '..', 'uploads'));

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
server.listen(PORT, () => {
    Logger.info(`Server is running on http://localhost:${PORT}`);
});
