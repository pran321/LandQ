import { Router } from 'express';
import { 
  createLead, 
  getMyLeads, 
  getLeadsForMyLands,
  updateLeadStatus,
  deleteLead 
} from '../controller/buyerLeadsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createLead);
router.get('/my-leads', authenticate, getMyLeads);
router.get('/received', authenticate, getLeadsForMyLands);
router.put('/:id/status', authenticate, updateLeadStatus);
router.delete('/:id', authenticate, deleteLead);

export default router;
