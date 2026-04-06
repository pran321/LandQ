import { Router } from 'express';
import {
  getAdminAnalytics,
  getSellerAnalytics,
} from '../controller/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/admin', authenticate, getAdminAnalytics);
router.get('/seller', authenticate, getSellerAnalytics);

export default router;
