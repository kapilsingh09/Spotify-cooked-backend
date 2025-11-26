import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';


const app = express();
// cors.Options = {
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   optionsSuccessStatus: 200
// };
// app.use(cors(cors));
// Load environment variables from .env file
dotenv.config(
  {
    path: './src/.env'
  }
);


// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to check if the server is running
import authRoutes from './src/routes/authRoutes.js';
import playlistRoutes from "./src/routes/playlistRoutes.js";

app.use("/api/playlists", playlistRoutes);

app.use('/auth', authRoutes);






app.get('/', (req, res) => {
  res.send('App is running !!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});