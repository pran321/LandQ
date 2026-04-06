import { Response } from 'express';
import SavedLandNote from '../models/savedLandNote';
import { AuthRequest } from '../middleware/auth';

export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const { landId, note, category } = req.body;

    if (!note) {
      return res.status(400).json({ message: 'Note is required' });
    }

    const savedNote = await SavedLandNote.create({
      userId: req.user._id,
      landId,
      note,
      category: category || 'general',
    });

    res.status(201).json({ message: 'Note added successfully', note: savedNote });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotesByLand = async (req: AuthRequest, res: Response) => {
  try {
    const { landId } = req.params;

    const notes = await SavedLandNote.find({
      userId: req.user._id,
      landId,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    res.json({ notes, count: notes.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note, category } = req.body;

    const savedNote = await SavedLandNote.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    });

    if (!savedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note) savedNote.note = note;
    if (category) savedNote.category = category;

    await savedNote.save();

    res.json({ message: 'Note updated successfully', note: savedNote });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const note = await SavedLandNote.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.deletedAt = new Date();
    await note.save();

    res.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
