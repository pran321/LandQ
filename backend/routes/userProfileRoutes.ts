import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controller/userProfileController';
import { authenticate } from '../middleware/auth';
import { uploadProfilePicture } from '../middleware/upload';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, uploadProfilePicture, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
