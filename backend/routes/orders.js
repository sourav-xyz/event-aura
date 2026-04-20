import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  addRating,
  getAllOrders,
  updateOrderStatus,
  addOrderNote
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/rating', protect, addRating);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/:id/notes', protect, adminOnly, addOrderNote);

export default router;
