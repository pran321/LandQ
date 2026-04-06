import { Router } from 'express';
import {
  createComparison,
  getMyComparisons,
  getComparisonById,
  deleteComparison,
} from '../controller/comparisonController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createComparison);
router.get('/', authenticate, getMyComparisons);
router.get('/:id', authenticate, getComparisonById);
router.delete('/:id', authenticate, deleteComparison);

export default router;
