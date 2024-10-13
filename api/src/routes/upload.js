import express from 'express';
import multer from 'multer';
import { uploadCSV } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Multer to handle file uploads

router.post('/', upload.single('csv'), uploadCSV);

export default router;
