import { Router } from 'express';
import {
  createReview,
  getReviewsByLand,
  updateReview,
  deleteReview,
} from '../controller/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/land/:landId', getReviewsByLand);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
