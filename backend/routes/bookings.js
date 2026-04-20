import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// POST booking
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;

    const newBooking = new Booking(bookingData);
    await newBooking.save();   // ✅ SAVE IN DB
    console.log('Booking saved:', newBooking); // Debug log
    res.status(200).json({
      success: true,
      data: {
        trackingId: "TRK" + Date.now()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;