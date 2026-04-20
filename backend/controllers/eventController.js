import Event from '../models/Event.js';
import Category from '../models/Category.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { category, search, featured, location, minPrice, maxPrice, sort } = req.query;
    
    let query = { isActive: true };

    // Filter by category
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Featured only
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Location filter
    if (location) {
      query.locations = { $in: [location, 'Both'] };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseInt(minPrice);
      if (maxPrice) query.basePrice.$lte = parseInt(maxPrice);
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { basePrice: 1 };
    if (sort === 'price-high') sortOption = { basePrice: -1 };
    if (sort === 'popular') sortOption = { bookingCount: -1 };
    if (sort === 'rating') sortOption = { 'rating.average': -1 };

    const events = await Event.find(query)
      .populate('category', 'name slug icon color')
      .sort(sortOption);

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

// @desc    Get single event by slug
// @route   GET /api/events/:slug
// @access  Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
      .populate('category', 'name slug icon color');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get related events
    const relatedEvents = await Event.find({
      category: event.category._id,
      _id: { $ne: event._id },
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      event,
      relatedEvents
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
export const getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug icon color')
      .limit(6);

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured events'
    });
  }
};

// @desc    Create event (Admin)
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    console.log("createEvent",req.body);
    console.log("Created event:", event);
    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
};

// @desc    Update event (Admin)
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

// @desc    Delete event (Admin)
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};

// @desc    Get all events (Admin - including inactive)
// @route   GET /api/events/admin/all
// @access  Private/Admin
export const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Get all events admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};
