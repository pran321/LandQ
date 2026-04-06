import { Router } from 'express';
import { 
  createLand, 
  getAllLands, 
  getLandById, 
  updateLand, 
  deleteLand,
  getMyLands 
} from '../controller/landController';
import { authenticate, authorize } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UserRole } from '../models/user';

// Ensure upload directories exist
const uploadDirs = ['uploads/lands', 'uploads/documents'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for land uploads (images + documents)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'documents') {
      cb(null, 'uploads/documents/');
    } else {
      cb(null, 'uploads/lands/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadLandFiles = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 5 },
]);

const router = Router();

router.post('/', authenticate, authorize(UserRole.ADMIN), uploadLandFiles, createLand);
router.get('/', getAllLands);
router.get('/my-lands', authenticate, getMyLands);
router.get('/:id', getLandById);
router.put('/:id', authenticate, uploadLandFiles, updateLand);
router.delete('/:id', authenticate, deleteLand);

export default router;
