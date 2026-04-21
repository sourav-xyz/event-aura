import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Event from './models/Event.js';

dotenv.config();

const categories = [
  {
    name: 'Wedding',
    description: 'Create your dream wedding with our expert planning services. From intimate ceremonies to grand celebrations.',
    icon: 'Heart',
    color: '#ec4899',
    order: 1
  },
  {
    name: 'Birthday',
    description: 'Celebrate another year of life with amazing birthday parties tailored to your style.',
    icon: 'Cake',
    color: '#f97316',
    order: 2
  },
  {
    name: 'Thread Ceremony',
    description: 'Honor traditional Upanayana ceremonies with authentic arrangements and rituals.',
    icon: 'Sparkles',
    color: '#eab308',
    order: 3
  },
  {
    name: 'Surprise Party',
    description: 'Plan the perfect surprise celebration that will create lasting memories.',
    icon: 'Gift',
    color: '#8b5cf6',
    order: 4
  },
  {
    name: 'Corporate Event',
    description: 'Professional event management for conferences, seminars, and corporate gatherings.',
    icon: 'Building',
    color: '#3b82f6',
    order: 5
  },
  {
    name: 'College Event',
    description: 'Energetic events for fests, freshers parties, and college celebrations.',
    icon: 'GraduationCap',
    color: '#10b981',
    order: 6
  },
  {
    name: 'Baby Shower',
    description: 'Celebrate the arrival of your little one with beautiful baby shower arrangements.',
    icon: 'Baby',
    color: '#f472b6',
    order: 7
  },
  {
    name: 'Anniversary',
    description: 'Mark your milestones with romantic anniversary celebrations.',
    icon: 'Heart',
    color: '#ef4444',
    order: 8
  },
  {
    name: 'Housewarming',
    description: 'Welcome guests to your new home with traditional Griha Pravesh ceremonies.',
    icon: 'Home',
    color: '#14b8a6',
    order: 9
  }
];

const createEvents = (categoryId, categoryName) => {
  const basePackages = [
    {
      name: 'Silver',
      price: 15000,
      description: 'Essential package for intimate gatherings',
      features: [
        'Basic decoration',
        'Up to 50 guests',
        'Standard lighting',
        '4 hours duration',
        'Basic sound system'
      ],
      isPopular: false
    },
    {
      name: 'Gold',
      price: 35000,
      description: 'Premium package for memorable celebrations',
      features: [
        'Premium decoration',
        'Up to 150 guests',
        'LED lighting setup',
        '6 hours duration',
        'Professional sound system',
        'Basic photography',
        'Welcome drinks'
      ],
      isPopular: true
    },
    {
      name: 'Premium',
      price: 75000,
      description: 'Luxury package for grand events',
      features: [
        'Luxury decoration',
        'Up to 500 guests',
        'Designer lighting',
        'Full day event',
        'Premium sound & DJ',
        'Professional photography & videography',
        'Catering included',
        'Live entertainment',
        'VIP arrangements'
      ],
      isPopular: false
    }
  ];

  const themes = [
    { name: 'Romantic', description: 'Soft colors, roses, and fairy lights', color: '#ec4899', additionalPrice: 5000 },
    { name: 'Royal', description: 'Gold, velvet, and regal decorations', color: '#eab308', additionalPrice: 8000 },
    { name: 'Kids Paradise', description: 'Cartoon themes, balloons, and fun elements', color: '#f97316', additionalPrice: 4000 },
    { name: 'Traditional', description: 'Cultural elements and classic decorations', color: '#dc2626', additionalPrice: 6000 },
    { name: 'Bollywood', description: 'Glamorous Bollywood-style decorations', color: '#8b5cf6', additionalPrice: 7000 }
  ];

  const addons = [
    { name: 'Premium Cake', description: 'Designer cake from top bakery', price: 3000, icon: 'Cake' },
    { name: 'Photography', description: 'Professional photography package', price: 8000, icon: 'Camera' },
    { name: 'DJ Service', description: 'Professional DJ with sound system', price: 12000, icon: 'Music' },
    { name: 'Catering', description: 'Per plate catering service', price: 500, icon: 'UtensilsCrossed' },
    { name: 'Anchor/Host', description: 'Professional event anchor', price: 5000, icon: 'Mic' }
  ];

  return {
    name: `${categoryName} Celebration`,
    category: categoryId,
    shortDescription: `Create unforgettable ${categoryName.toLowerCase()} moments with our expert planning.`,
    description: `Experience the magic of a perfectly planned ${categoryName.toLowerCase()} with EventAura. Our team of experts will handle every detail, from decoration to catering, ensuring your special day is nothing short of extraordinary. With our premium services available in Bhubaneswar and Berhampur, we bring your vision to life with creativity, precision, and care.`,
    coverImage: '/images/events/placeholder.jpg',
    gallery: [],
    packages: basePackages,
    themes,
    addons,
    basePrice: 15000,
    duration: '4-8 hours',
    capacity: { min: 20, max: 500 },
    locations: ['Bhubaneswar', 'Berhampur'],
    features: [
      'Personalized planning',
      'Venue coordination',
      'Decoration setup',
      'Event coordination',
      'Vendor management'
    ],
    inclusions: [
      'Theme-based decoration',
      'Basic sound system',
      'Lighting setup',
      'Event coordination',
      'Setup and cleanup'
    ],
    exclusions: [
      'Venue rental',
      'Food and beverages (unless in package)',
      'Guest accommodation',
      'Transportation'
    ],
    faqs: [
      {
        question: 'How far in advance should I book?',
        answer: 'We recommend booking at least 2-4 weeks in advance for standard events, and 2-3 months for weddings and large events.'
      },
      {
        question: 'Can I customize the packages?',
        answer: 'Absolutely! All our packages can be customized to match your specific requirements and budget.'
      },
      {
        question: 'Do you provide venue recommendations?',
        answer: 'Yes, we have partnerships with various venues in Bhubaneswar and Berhampur and can help you find the perfect location.'
      }
    ],
    isActive: true,
    isFeatured: ['Wedding', 'Birthday', 'Corporate Event'].includes(categoryName)
  };
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});


    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@eventaura.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true
    });


    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create events for each category
    const events = createdCategories.map(cat => createEvents(cat._id, cat.name));
    await Event.insertMany(events);
    console.log(`Created ${events.length} events`);

    console.log('Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@eventaura.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
