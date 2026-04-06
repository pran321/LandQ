import { Router } from 'express';
import {
  createOffer,
  getMyOffers,
  getReceivedOffers,
  respondToOffer,
  deleteOffer,
} from '../controller/priceOfferController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createOffer);
router.get('/my-offers', authenticate, getMyOffers);
router.get('/received', authenticate, getReceivedOffers);
router.put('/:id/respond', authenticate, respondToOffer);
router.delete('/:id', authenticate, deleteOffer);

export default router;
