import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from src/.env if not already loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
};

if (!spotifyConfig.clientId) {
  // Helpful runtime error to aid debugging when env is missing
  console.warn('Warning: SPOTIFY_CLIENT_ID is not set. Spotify auth requests will fail.');
}
