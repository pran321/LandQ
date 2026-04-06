import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyerLeads extends Document {
  buyerId: mongoose.Types.ObjectId;
  landId: mongoose.Types.ObjectId;
  status: 'pending' | 'contacted' | 'interested' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const buyerLeadsSchema = new Schema<IBuyerLeads>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    landId: {
      type: Schema.Types.ObjectId,
      ref: 'Land',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'interested', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
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

const BuyerLeads = mongoose.model<IBuyerLeads>('BuyerLeads', buyerLeadsSchema);

export default BuyerLeads;
