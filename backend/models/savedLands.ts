import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedLands extends Document {
  userId: mongoose.Types.ObjectId;
  landId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const savedLandsSchema = new Schema<ISavedLands>(
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
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate saves
savedLandsSchema.index({ userId: 1, landId: 1 }, { unique: true });

const SavedLands = mongoose.model<ISavedLands>('SavedLands', savedLandsSchema);

export default SavedLands;
