import { Response } from 'express';
import SavedLands from '../models/savedLands';
import { AuthRequest } from '../middleware/auth';

export const saveLand = async (req: AuthRequest, res: Response) => {
  try {
    const { landId } = req.body;

    const existingSave = await SavedLands.findOne({
      userId: req.user._id,
      landId,
      deletedAt: null,
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Land already saved' });
    }

    const savedLand = await SavedLands.create({
      userId: req.user._id,
      landId,
    });

    res.status(201).json({ message: 'Land saved successfully', savedLand });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedLands = async (req: AuthRequest, res: Response) => {
  try {
    const savedLands = await SavedLands.find({
      userId: req.user._id,
      deletedAt: null,
    }).populate('landId');

    res.json({ savedLands, count: savedLands.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveLand = async (req: AuthRequest, res: Response) => {
  try {
    const { landId } = req.params;

    const savedLand = await SavedLands.findOne({
      userId: req.user._id,
      landId,
      deletedAt: null,
    });

    if (!savedLand) {
      return res.status(404).json({ message: 'Saved land not found' });
    }

    savedLand.deletedAt = new Date();
    await savedLand.save();

    res.json({ message: 'Land unsaved successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
