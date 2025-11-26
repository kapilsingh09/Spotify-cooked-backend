import express from 'express';
import dotenv from 'dotenv'
const app = express();

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

app.use('/auth', authRoutes);






app.get('/', (req, res) => {
  res.send('App is running !!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});