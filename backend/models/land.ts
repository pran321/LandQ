import mongoose, { Schema, Document } from 'mongoose';

export interface ILand extends Document {
  title: string;
  description: string;
  price: number;
  size: number;
  length: number;
  breadth: number;
  area: number;
  location: string;
  city: string;
  state: string;
  lat: number;
  long: number;
  images: string[];
  landType: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed';
  amenities: string[];
  documents: string[];
  views: number;
  featured: boolean;
  seller: mongoose.Types.ObjectId;
  status: 'available' | 'sold' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const landSchema = new Schema<ILand>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    length: {
      type: Number,
      required: [true, 'Length is required'],
    },
    breadth: {
      type: Number,
      required: [true, 'Breadth is required'],
    },
    area: {
      type: Number,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    landType: {
      type: String,
      enum: ['residential', 'commercial', 'agricultural', 'industrial', 'mixed'],
      default: 'residential',
    },
    amenities: {
      type: [String],
      default: [],
    },
    documents: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
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

// Pre-save middleware to calculate area
landSchema.pre('save', function (next) {
  if (this.isModified('length') || this.isModified('breadth')) {
    this.area = this.length * this.breadth;
  }
  next();
});

const Land = mongoose.model<ILand>('Land', landSchema);

export default Land;
