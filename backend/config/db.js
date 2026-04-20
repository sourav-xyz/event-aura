import mongoose from "mongoose";
import dns from 'dns';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/eventaura';

    // Ensure we have a reliable DNS resolver for SRV (Atlas) lookups
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (e) {
      // ignore if setServers not permitted in this environment
    }

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit if DB not connected
  }
};

export default connectDB;