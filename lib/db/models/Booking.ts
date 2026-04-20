import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  trackingId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  venue: string;
  packageType: string;
  customServices?: string[];
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: 1,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    packageType: {
      type: String,
      required: [true, 'Package type is required'],
    },
    customServices: {
      type: [String],
      default: [],
    },
    additionalNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Generate tracking ID before saving
BookingSchema.pre('save', function (next) {
  if (!this.trackingId) {
    const prefix = 'EVT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.trackingId = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
