import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceOffer extends Document {
  buyerId: mongoose.Types.ObjectId;
  landId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  offerPrice: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
  counterMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const priceOfferSchema = new Schema<IPriceOffer>(
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
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered'],
      default: 'pending',
    },
    counterPrice: {
      type: Number,
    },
    counterMessage: {
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

const PriceOffer = mongoose.model<IPriceOffer>('PriceOffer', priceOfferSchema);

export default PriceOffer;
