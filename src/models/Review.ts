import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment: string;
  userId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  listingId?: mongoose.Types.ObjectId;
  experienceId?: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing'
  },
  experienceId: {
    type: Schema.Types.ObjectId,
    ref: 'Experience'
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
reviewSchema.index({ userId: 1 });
reviewSchema.index({ listingId: 1 });
reviewSchema.index({ experienceId: 1 });
reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Unique index to prevent duplicate reviews
reviewSchema.index({ userId: 1, bookingId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
