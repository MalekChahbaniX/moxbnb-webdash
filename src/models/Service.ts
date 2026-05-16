import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  type: 'privateChef' | 'massage' | 'sportsCoach' | 'photography' | 'hairdressing' | 'catering';
  location: string;
  city: string;
  price: number;
  currency: string;
  duration: string;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
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
    enum: ['privateChef', 'massage', 'sportsCoach', 'photography', 'hairdressing', 'catering']
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
  duration: {
    type: String,
    required: true,
    trim: true
  },
  providerId: {
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
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ city: 1 });
serviceSchema.index({ type: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ providerId: 1 });
serviceSchema.index({ isAvailable: 1 });
serviceSchema.index({ createdAt: -1 });

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
