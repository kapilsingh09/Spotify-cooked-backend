import axios from "axios";

// Fetch user's playlists from Spotify
export const getUserPlaylists = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No access token provided" });
    }

    // Fetch playlists from Spotify API
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        limit: 50, // Get up to 50 playlists
      },
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Error fetching playlists:", err.response?.data || err);
    return res.status(500).json({ 
      error: "Failed to fetch playlists",
      details: err.response?.data || err.message 
    });
  }
};
