import { Router } from 'express';
import {
  submitAadhaar,
  getAadhaarStatus,
  verifyAadhaar,
  getPendingVerifications,
  getVerifiedUsers
} from '../controller/aadhaarController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/user';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/aadhaar';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for Aadhaar document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'aadhaar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadAadhaar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
    }
  },
});

const router = Router();

// User routes
router.post('/submit', authenticate, uploadAadhaar.single('aadhaarDocument'), submitAadhaar);
router.get('/status', authenticate, getAadhaarStatus);

// Admin routes
router.get('/pending', authenticate, authorize(UserRole.ADMIN), getPendingVerifications);
router.get('/verified', authenticate, authorize(UserRole.ADMIN), getVerifiedUsers);
router.put('/verify/:userId', authenticate, authorize(UserRole.ADMIN), verifyAadhaar);

export default router;
