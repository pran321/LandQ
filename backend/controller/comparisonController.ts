import { Response } from 'express';
import Comparison from '../models/comparison';
import { AuthRequest } from '../middleware/auth';

export const createComparison = async (req: AuthRequest, res: Response) => {
  try {
    const { landIds, name } = req.body;

    if (!landIds || landIds.length < 2) {
      return res.status(400).json({ message: 'Please select at least 2 lands to compare' });
    }

    if (landIds.length > 4) {
      return res.status(400).json({ message: 'You can compare maximum 4 lands at a time' });
    }

    const comparison = await Comparison.create({
      userId: req.user._id,
      landIds,
      name: name || 'My Comparison',
    });

    await comparison.populate('landIds');

    res.status(201).json({ message: 'Comparison created successfully', comparison });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyComparisons = async (req: AuthRequest, res: Response) => {
  try {
    const comparisons = await Comparison.find({
      userId: req.user._id,
      deletedAt: null,
    })
      .populate('landIds')
      .sort({ createdAt: -1 });

    res.json({ comparisons, count: comparisons.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComparisonById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const comparison = await Comparison.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    }).populate('landIds');

    if (!comparison) {
      return res.status(404).json({ message: 'Comparison not found' });
    }

    res.json({ comparison });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComparison = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const comparison = await Comparison.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    });

    if (!comparison) {
      return res.status(404).json({ message: 'Comparison not found' });
    }

    comparison.deletedAt = new Date();
    await comparison.save();

    res.json({ message: 'Comparison deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
