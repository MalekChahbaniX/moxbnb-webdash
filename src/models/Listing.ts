import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'villa' | 'privateRoom' | 'cabin';
  location: string;
  city: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities?: string[];
  houseRules?: string;
  images?: string[];
  hostId: mongoose.Types.ObjectId;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'villa', 'privateRoom', 'cabin']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'DT',
    enum: ['DT', 'EUR', 'USD']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  amenities: [{
    type: String,
    trim: true
  }],
  houseRules: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ city: 1 });
listingSchema.index({ type: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ maxGuests: 1 });
listingSchema.index({ rating: -1 });
listingSchema.index({ hostId: 1 });
listingSchema.index({ isActive: 1 });
listingSchema.index({ createdAt: -1 });

export const Listing = mongoose.models.Listing || mongoose.model<IListing>('Listing', listingSchema);
