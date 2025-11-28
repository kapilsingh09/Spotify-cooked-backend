import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------------------------
// STEP 1: Redirect user to Spotify Login Page
// ---------------------------------------------
export const spotifyLogin = (req, res) => {
  const scope =
    "user-read-email user-read-private user-top-read playlist-read-private playlist-read-collaborative";

  const redirectUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });

  return res.redirect(redirectUrl);
};

// ---------------------------------------------
// STEP 2: Spotify Callback → Exchange Code for Tokens
// ---------------------------------------------
export const spotifyCallback = async (req, res) => {
  const code = req.query.code; // Spotify returns auth code

  try {
    // EXCHANGE CODE FOR TOKENS
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, refresh_token } = response.data;

    // Determine Frontend URL and use a safe fallback if it's not provided
    // const rawFrontendUrl = process.env.FRONTEND_URL || process.env.ALLOWED_ORIGINS || "https://spotify-cooked-frontend.vercel.app";
    // ensure no trailing slash
    // const frontendUrl = rawFrontendUrl.replace(/\/$/, "");

    // ⭐ Redirect back to frontend with tokens ⭐
    // console.log("Redirecting to frontend at:", `${frontendUrl}/dashboard`);

    return res.redirect(
      `https://spotify-cooked-frontend.vercel.app/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`
    );

  } catch (err) {
    console.log("Spotify Auth Error:", err.response?.data || err);
    return res.status(500).send("Spotify Authentication Failed");
  }
};
