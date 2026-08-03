import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import passport from 'passport';
import { checkRole } from '../../middleware/authMiddleware.js';

const uploadrouter = express.Router();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to frontend uploads directory
const frontendUploadsDir = path.resolve(
    __dirname,
    '../../../frontend/DBMS frontend/public/uploads'
);

// Ensure the uploads directory exists
if (!fs.existsSync(frontendUploadsDir)) {
    fs.mkdirSync(frontendUploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        return cb(null, frontendUploadsDir);
    },
    filename(req, file, cb) {
        return cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpe?g|png|gif|webp/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only (jpeg, jpg, png, gif, webp)!');
    }
}

// Initialize upload
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Route for uploading product images
uploadrouter.post(
    '/',
    upload.single('image'),
    (req, res) => {
        // console.log(req.body)
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        // Return the full URL path to the image (relative to frontend public)
        const imageUrl = `/public/uploads/${req.file.filename}`;
        console.log(imageUrl);
        res.json({ url: imageUrl });
    }
);

export default uploadrouter;
