import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { uploadVideo } from '../controllers/videoController.js';

const router = express.Router();

// Store uploads on disk to avoid memory exhaustion for large files
const uploadDir = path.resolve('uploads', 'videos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const safeName = `${timestamp}_${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, safeName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB limite (ajuste conforme necessário)
});

// POST /videos/upload
router.post('/upload', upload.single('file'), uploadVideo);

export default router;
