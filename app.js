import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from "express-rate-limit"; // ✅ ADDED: rate limiting

const app = express();

dotenv.config({ path: './.env' });

// --------------------------------------------------
//  IMPORTANT FOR PRODUCTION (Render / Railway / Vercel / Nginx)
// This ensures correct IP detection for rate limitin
app.set("trust proxy", 1); // ADDED

// BEST PRACTICE: SAFE ALLOWED ORIGINS
const allowedOrigins = [
  // "http://localhost:5173",
  // "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
];

// FIXED CORS MIDDLEWARE
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS: Not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//RATE LIMITERS

// GLOBAL LIMITER (applies to all routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

// AUTH LIMITER (login / register protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max auth attempts
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later."
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window 
  max: 20, // prevent abuse
  message: {
    success: false,
    message: "AI request limit reached. Please wait."
  }
});

// Apply GLOBAL rate limiter
app.use(globalLimiter); // ✅ ADDED

// JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Import routes
// --------------------------------------------------
import authRoutes from './src/routes/authRoutes.js';
import playlistRoutes from "./src/routes/playlistRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { initializeGemini } from "./src/services/geminiService.js";

// Initialize Gemini
initializeGemini();

// Register routes with specific rate limiters
app.use('/auth', authLimiter, authRoutes);        //auth
app.use("/api/playlists", playlistRoutes);       
app.use("/api/ai", aiLimiter, aiRoutes);          

// Base route
app.get('/', (req, res) => {
  res.send('Cooked ! APP is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
