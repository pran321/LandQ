import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedLandNote extends Document {
  userId: mongoose.Types.ObjectId;
  landId: mongoose.Types.ObjectId;
  note: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const savedLandNoteSchema = new Schema<ISavedLandNote>(
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
    note: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'general',
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

const SavedLandNote = mongoose.model<ISavedLandNote>('SavedLandNote', savedLandNoteSchema);

export default SavedLandNote;
