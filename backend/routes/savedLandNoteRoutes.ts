import { Router } from 'express';
import {
  addNote,
  getNotesByLand,
  updateNote,
  deleteNote,
} from '../controller/savedLandNoteController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, addNote);
router.get('/land/:landId', authenticate, getNotesByLand);
router.put('/:id', authenticate, updateNote);
router.delete('/:id', authenticate, deleteNote);

export default router;
