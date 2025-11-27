import { roastPlaylists } from "../services/geminiService.js";

// Roast user's playlists using Gemini AI
export const roastUserPlaylists = async (req, res) => {
  try {
    const { playlists } = req.body;

    if (!playlists || !Array.isArray(playlists) || playlists.length === 0) {
      return res.status(400).json({ error: "No playlists provided" });
    }

    // Generate roast using Gemini AI
    const roast = await roastPlaylists(playlists);

    return res.json({
      success: true,
      roast: roast,
    });
  } catch (err) {
    console.error("Error roasting playlists:", err);
    return res.status(500).json({ 
      error: "Failed to roast playlists",
      details: err.message 
    });
  }
};
