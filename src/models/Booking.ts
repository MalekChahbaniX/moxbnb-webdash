import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  type: 'property' | 'experience' | 'service';
  itemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  type: {
    type: String,
    required: true,
    enum: ['property', 'experience', 'service']
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ itemId: 1 });
bookingSchema.index({ type: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
