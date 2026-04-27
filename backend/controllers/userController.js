import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// @desc    Update avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.avatar = req.body.avatar;
    await user.save();

    res.json({
      success: true,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update avatar'
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    console.log('Fetching dashboard for user:', req.user._id);
    const orders = await Order.find({ user: req.user._id })
      .populate('event', 'name slug coverImage')
      .sort({ createdAt: -1 })
      .limit(5);
    console.log('User dashboard orders:', orders);
    const stats = {
      totalOrders: await Order.countDocuments({ user: req.user._id }),
      completedOrders: await Order.countDocuments({ user: req.user._id, status: 'completed' }),
      pendingOrders: await Order.countDocuments({ user: req.user._id, status: { $in: ['pending', 'confirmed', 'in-progress'] } }),
      totalSpent: (await Order.aggregate([
        { $match: { user: req.user._id, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]))[0]?.total || 0
    };

    console.log('User dashboard stats:', stats);

    res.json({
      success: true,
      stats,
      recentOrders: orders
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard'
    });
  }
};

// ADMIN ROUTES

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/all
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    // Get order counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        const totalSpent = (await Order.aggregate([
          { $match: { user: user._id, status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$pricing.total' } } }
        ]))[0]?.total || 0;

        return {
          ...user.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    res.json({
      success: true,
      count: users.length,
      users: usersWithStats
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Get user by ID (Admin)
// @route   GET /api/users/admin/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const orders = await Order.find({ user: user._id })
      .populate('event', 'name slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      orders
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/admin/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = req.body.role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
};

// @desc    Block/Unblock user (Admin)
// @route   PUT /api/users/admin/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow blocking yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot block your own account'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user
    });
  } catch (error) {
    console.error('Toggle block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user block status'
    });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/admin/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    const totalRevenue = (await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]))[0]?.total || 0;

    const recentOrders = await Order.find()
      .populate('event', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Orders by category
    const ordersByCategory = await Order.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      },
      recentOrders,
      recentUsers,
      monthlyRevenue,
      ordersByCategory
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard'
    });
  }
};
