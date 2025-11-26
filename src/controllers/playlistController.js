// src/controllers/playlistController.js
import axios from "axios";

export const getUserPlaylists = async (req, res) => {
  // Access token sent in Authorization header: Bearer <token>
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Access token missing" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.json({
      success: true,
      playlists: response.data.items, // array of playlists
    });
  } catch (err) {
    console.error(err.response?.data || err);
    return res.status(500).json({ error: "Failed to fetch playlists" });
  }
};
