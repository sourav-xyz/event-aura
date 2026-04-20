import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Silver', 'Gold', 'Premium']
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  features: [String],
  isPopular: {
    type: Boolean,
    default: false
  }
});

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  color: String,
  additionalPrice: {
    type: Number,
    default: 0
  }
});

const addonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  icon: String,
  image: String
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an event name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  coverImage: {
    type: String,
    required: true
  },
  gallery: [String],
  packages: [packageSchema],
  themes: [themeSchema],
  addons: [addonSchema],
  basePrice: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: '4-6 hours'
  },
  capacity: {
    min: { type: Number, default: 10 },
    max: { type: Number, default: 500 }
  },
  locations: [{
    type: String,
    enum: ['Bhubaneswar', 'Berhampur', 'Both'],
    default: 'Both'
  }],
  features: [String],
  inclusions: [String],
  exclusions: [String],
  faqs: [{
    question: String,
    answer: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  bookingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
eventSchema.index({ name: 'text', description: 'text' });

const Event = mongoose.model('Event', eventSchema);
export default Event;
