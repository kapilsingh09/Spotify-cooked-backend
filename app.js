import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

// Load environment variables from .env file
dotenv.config();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:5173', // Allow frontend
  credentials: true
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