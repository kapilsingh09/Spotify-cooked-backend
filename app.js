import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

// Load environment variables
dotenv.config();

// BEST PRACTICE: SAFE ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://spotify-cooked-frontend.vercel.app"
];

// FIXED CORS MIDDLEWARE
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      // allowed
      return callback(null, true);
    }

    // not allowed
    return callback(new Error("CORS: Not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import playlistRoutes from "./src/routes/playlistRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { initializeGemini } from "./src/services/geminiService.js";

// Initialize Gemini
initializeGemini();

// Register routes
app.use('/auth', authRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/ai", aiRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Cooked API is running! 🔥');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
