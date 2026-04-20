import express from 'express';
import {
  updateProfile,
  updateAvatar,
  getDashboard,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
  getAdminDashboard
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, updateAvatar);
router.get('/dashboard', protect, getDashboard);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllUsers);
router.get('/admin/dashboard', protect, adminOnly, getAdminDashboard);
router.get('/admin/:id', protect, adminOnly, getUserById);
router.put('/admin/:id/role', protect, adminOnly, updateUserRole);
router.put('/admin/:id/block', protect, adminOnly, toggleBlockUser);
router.delete('/admin/:id', protect, adminOnly, deleteUser);

export default router;
