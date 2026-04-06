import { Router } from 'express';
import { 
  saveLand, 
  getSavedLands, 
  unsaveLand 
} from '../controller/savedLandsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, saveLand);
router.get('/', authenticate, getSavedLands);
router.delete('/:landId', authenticate, unsaveLand);

export default router;
