import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  description: string;
  category: 'cultural' | 'culinary' | 'adventure' | 'artistic' | 'guidedTour';
  location: string;
  city: string;
  price: number;
  currency: string;
  duration: string;
  maxGuests: number;
  requirements?: string;
  images?: string[];
  hostId: mongoose.Types.ObjectId;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
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
  category: {
    type: String,
    required: true,
    enum: ['cultural', 'culinary', 'adventure', 'artistic', 'guidedTour']
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
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  requirements: {
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
experienceSchema.index({ title: 'text', description: 'text' });
experienceSchema.index({ city: 1 });
experienceSchema.index({ category: 1 });
experienceSchema.index({ price: 1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ hostId: 1 });
experienceSchema.index({ isActive: 1 });
experienceSchema.index({ createdAt: -1 });

export const Experience = mongoose.model<IExperience>('Experience', experienceSchema);
