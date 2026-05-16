import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ receiverId: 1, isRead: 1 });
messageSchema.index({ bookingId: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
