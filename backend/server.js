import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import eventRoutes from './routes/events.js';
import orderRoutes from './routes/orders.js';
// import bookingRoutes from './routes/bookings.old.js'; 

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS (must come before body parsers and cookie parser)
const allowedOrigins = [
  "http://localhost:3000",
  "https://event-aura-pi.vercel.app",
  "https://event-aura-h42z.vercel.app",
  "https://event-aura-production-9a1b.up.railway.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);  
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() }); 
});

// ✅ Root route - SABSE LAST mein aur app.get use karo
app.get("/", (req, res) => {
  res.send("Api is working");
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
