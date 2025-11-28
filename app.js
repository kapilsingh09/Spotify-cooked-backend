import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

// Load environment variables from .env file
dotenv.config();

// Enable CORS for frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'https://spotify-cooked-frontend.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import playlistRoutes from "./src/routes/playlistRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { initializeGemini } from "./src/services/geminiService.js";

// Initialize Gemini AI
initializeGemini();

// Register routes
app.use('/auth', authRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/ai", aiRoutes);

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Cooked API is running! 🔥');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});