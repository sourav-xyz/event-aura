import express from 'express';
import {
  getEvents,
  getEvent,
  getFeaturedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEventsAdmin
} from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:slug', getEvent);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllEventsAdmin);
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;
