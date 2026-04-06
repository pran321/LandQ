import { Response } from 'express';
import Review from '../models/review';
import Land from '../models/land';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { landId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const land = await Land.findById(landId);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    const existingReview = await Review.findOne({
      userId: req.user._id,
      landId,
      deletedAt: null,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this land' });
    }

    const review = await Review.create({
      userId: req.user._id,
      landId,
      rating,
      comment,
    });

    await review.populate('userId', 'name profilePicture');

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByLand = async (req: AuthRequest, res: Response) => {
  try {
    const { landId } = req.params;

    const reviews = await Review.find({
      landId,
      deletedAt: null,
    })
      .populate('userId', 'name profilePicture')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      count: reviews.length,
      averageRating: avgRating.toFixed(1),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate('userId', 'name profilePicture');

    res.json({ message: 'Review updated successfully', review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.deletedAt = new Date();
    await review.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
