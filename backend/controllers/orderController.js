import Order from '../models/Order.js';
import Event from '../models/Event.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (guests can book, or authenticated users)
export const createOrder = async (req, res) => {
  console.log('Create order request received');
  try {
    const {
      event: eventId,
      packageSelected,
      themeSelected,
      addonsSelected,
      eventDetails,
      contactInfo,
      pricing
    } = req.body;

    console.log('Create order request body:', req.body);

    // Event is optional - try to find if provided, but don't fail if not found
    let event = null;
    let categoryId = null;
    
    if (eventId) {
      event = await Event.findById(eventId).populate('category');
      if (event) {
        categoryId = event.category._id;
        // Update event booking count
        event.bookingCount += 1;
        await event.save();
      }
    }

    // Create order - event is optional
    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      event: eventId || undefined,
      category: categoryId || undefined,
      packageSelected,
      themeSelected,
      addonsSelected,
      eventDetails,
      contactInfo: {
        name: contactInfo?.name || (req.user?.name || 'Guest'),
        email: contactInfo?.email || (req.user?.email || ''),
        phone: contactInfo?.phone || (req.user?.phone || ''),
        alternatePhone: contactInfo?.alternatePhone
      },
      pricing,
      status: 'pending',
      statusHistory: [{ status: 'pending', updatedAt: new Date() }]
    });
    console.log('Order created:', order);
    // Send confirmation email
    const populatedOrder = await Order.findById(order._id)
      .populate('event', 'name')
      .populate('user', 'email');

      console.log('Populated order for email:', populatedOrder);

    const emailContent = emailTemplates.orderConfirmation({
      ...order.toObject(),
      eventName: event?.name || 'Event Booking'
    });

    await sendEmail({
      to: order.contactInfo.email,
      subject: emailContent.subject,
      html: emailContent.html
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        _id: populatedOrder._id,
        orderNumber: populatedOrder.orderNumber,
        trackingId: populatedOrder.orderNumber,  // Use orderNumber as trackingId
        status: populatedOrder.status,
        contactInfo: populatedOrder.contactInfo,
        eventDetails: populatedOrder.eventDetails,
        pricing: populatedOrder.pricing,
        createdAt: populatedOrder.createdAt
      },
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('event', 'name slug coverImage')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('event', 'name slug coverImage packages themes addons')
      .populate('category', 'name')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['completed', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'This order cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    order.cancelReason = req.body.reason;
    order.cancelledAt = new Date();
    await order.save();

    // Send cancellation email
    const populatedOrder = await Order.findById(order._id).populate('event', 'name');
    const emailContent = emailTemplates.orderStatusUpdate(
      { ...order.toObject(), eventName: populatedOrder.event.name },
      'Cancelled'
    );

    await sendEmail({
      to: order.contactInfo.email,
      subject: emailContent.subject,
      html: emailContent.html
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// @desc    Add rating to order
// @route   PUT /api/orders/:id/rating
// @access  Private
export const addRating = async (req, res) => {
  try {
    const { score, review } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this order'
      });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed orders'
      });
    }

    order.rating = {
      score,
      review,
      ratedAt: new Date()
    };
    await order.save();

    // Update event rating
    const event = await Event.findById(order.event);
    if (event) {
      const orders = await Order.find({
        event: event._id,
        'rating.score': { $exists: true }
      });
      
      const totalRating = orders.reduce((sum, o) => sum + o.rating.score, 0);
      event.rating = {
        average: totalRating / orders.length,
        count: orders.length
      };
      await event.save();
    }

    res.json({
      success: true,
      message: 'Rating added successfully',
      order
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating'
    });
  }
};

// ADMIN ROUTES

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'contactInfo.name': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    const orders = await Order.find(query)
      .populate('event', 'name slug')
      .populate('category', 'name')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    console.log('First order:', orders[0] ? {
      id: orders[0]._id,
      contactInfo: orders[0].contactInfo,
      pricing: orders[0].pricing,
      eventDetails: orders[0].eventDetails
    } : 'No orders');

    // Calculate stats
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      inProgress: orders.filter(o => o.status === 'in-progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
    };

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      totalPages,
      stats,
      data: {
        orders,
        totalPages
      },
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id,
      updatedAt: new Date()
    });
    await order.save();

    // Send status update email
    const populatedOrder = await Order.findById(order._id).populate('event', 'name');
    const emailContent = emailTemplates.orderStatusUpdate(
      { ...order.toObject(), eventName: populatedOrder.event.name },
      status.charAt(0).toUpperCase() + status.slice(1)
    );

    await sendEmail({
      to: order.contactInfo.email,
      subject: emailContent.subject,
      html: emailContent.html
    });

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// @desc    Add note to order (Admin)
// @route   POST /api/orders/:id/notes
// @access  Private/Admin
export const addOrderNote = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.notes.push({
      text: req.body.text,
      addedBy: req.user._id,
      addedAt: new Date()
    });
    await order.save();

    res.json({
      success: true,
      message: 'Note added',
      order
    });
  } catch (error) {
    console.error('Add order note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
};
