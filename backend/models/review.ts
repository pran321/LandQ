import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  landId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    landId: {
      type: Schema.Types.ObjectId,
      ref: 'Land',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews
reviewSchema.index({ userId: 1, landId: 1 }, { unique: true });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
