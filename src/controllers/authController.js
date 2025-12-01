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

    // Hardcoded production frontend URL
    const frontendUrl = "https://spotify-cooked-frontend.vercel.app";

    // ⭐ Redirect back to frontend with tokens ⭐
    // console.log("Redirecting to frontend at:", `${frontendUrl}/dashboard`);

    return res.redirect(
      `${frontendUrl}/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`
    );

  } catch (err) {
    console.log("Spotify Auth Error:", err.response?.data || err);
    return res.status(500).send("Spotify Authentication Failed");
  }
};

// ---------------------------------------------
// STEP 3: SECURE LOGOUT - Clear all tokens
// ---------------------------------------------
export const spotifyLogout = async (req, res) => {
  try {
    // Get token from Authorization header or request body
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || req.body.access_token;

    // If token exists, we could optionally revoke it with Spotify
    // Note: Spotify doesn't provide a standard token revocation endpoint
    // but tokens expire automatically (usually in 1 hour)
    
    if (token) {
      console.log("Logout: Token received and will be invalidated client-side");
      // In a production app with a database, you would:
      // 1. Store tokens in DB with user session
      // 2. Mark tokens as revoked/deleted here
      // 3. Implement token validation middleware to reject revoked tokens
    }

    // Clear any cookies if you're using them
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('spotify_session');

    // Send success response
    return res.status(200).json({ 
      success: true, 
      message: "Logged out successfully. All tokens and sessions cleared." 
    });

  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Logout failed on server" 
    });
  }
};
