import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  eventDetails: Object,
  contactInfo: Object,
  packageSelected: Object,
  themeSelected: Object,
  addonsSelected: Array,
  pricing: Object,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);