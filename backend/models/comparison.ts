import mongoose, { Schema, Document } from 'mongoose';

export interface IComparison extends Document {
  userId: mongoose.Types.ObjectId;
  landIds: mongoose.Types.ObjectId[];
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const comparisonSchema = new Schema<IComparison>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    landIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Land',
    }],
    name: {
      type: String,
      default: 'My Comparison',
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

const Comparison = mongoose.model<IComparison>('Comparison', comparisonSchema);

export default Comparison;
