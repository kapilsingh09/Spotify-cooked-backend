import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;
let model;

/**
 * Initialize Gemini AI generative model
 * @returns {import("@google/generative-ai").GenerativeModel | null}
 */
export const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is not set. AI roasting will not work.");
    return null;
  }

  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  return model;
};

/** 
 * Array of emojis for extra flair
 */
const extraEmojis = [
  "💀", "😂", "🔥", "😭", "🎵", "🎪", "🤡", "🎧", "🎤", "😹", "🥳", "🤣",
];

/**
 * Utility to get random emojis from the array
 * @param {number} count Number of emojis to pick
 * @returns {string} Emojis string
 */
const getRandomEmojis = (count = 5) => {
  const shuffled = extraEmojis.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
};

/**
 * Build the roast prompt with bullet point output format
 * @param {string} playlistSummary
 * @returns {string} prompt string
 */
const buildRoastPrompt = (playlistSummary) => {
  return `
You are a hilarious, savage music critic who roasts Spotify playlists with BRUTAL honesty and comedy. Think of yourself as a stand-up comedian meeting a music snob. Your roasts should be:

🔥 PACKED with emojis (at least 5-8 emojis total)
😂 Side-splittingly funny with jokes and puns
💀 Savage but never genuinely mean
🎭 Creative and unexpected observations
😭 Include "crying laughing" reactions to their choices

Here are the user's Spotify playlists:

${playlistSummary || "No playlists found, but you gotta roast something!"}

Write an ABSOLUTELY HILARIOUS roast in 4-5 bullet points. Keep it SHORT and SNAPPY — no more than 100 words total. Use plenty of emojis (${getRandomEmojis(7)}).

💥 **IMPORTANT: Format the roast STRICTLY as bullet points. Each bullet point must start with a "•" (bullet character) followed by a space, and be on its own line.** For example:

• This playlist name is so original, it must be copyrighted 😂🔥  
• 15 tracks? That's more like a warm-up set for a real DJ 💀🎧

Make jokes about:
- Their terrible playlist names
- How they organize (or don't organize) their music  
- The number of tracks (too many? too few?)
- Any patterns you notice
- Compare them to funny relatable situations

Make them laugh SO HARD they'll actually share this roast with their friends! Be creative, witty, and don't hold back on the comedy! 😂🔥
`;
};


/**
 * Generate a savage but funny roast for Spotify playlists using Gemini AI
 * @param {Array<{name: string, tracks?: { total: number }, public?: boolean}>} playlists
 * @returns {Promise<string>} Roast text
 */
export const roastPlaylists = async (playlists) => {
  try {
    if (!model) {
      model = initializeGemini();
      if (!model) {
        throw new Error("Gemini API key not configured");
      }
    }

    // Build playlist summary for prompt
    const playlistSummary = playlists.length
      ? playlists
          .map((pl, i) => {
            const trackCount = pl.tracks?.total ?? 0;
            const isPublic = pl.public ? "Public" : "Private";
            return `${i + 1}. "${pl.name}" - ${trackCount} track${trackCount !== 1 ? "s" : ""} (${isPublic})`;
          })
          .join("\n")
      : "";

    const prompt = buildRoastPrompt(playlistSummary);

    // Generate roast content
    const result = await model.generateContent(prompt);

    // Await and extract text response properly to avoid undefined
    const response = await result.response;
    const roastText = await response.text();

    return roastText.trim();
  } catch (error) {
    console.error("❌ Error generating roast:", error);
    throw new Error("Failed to generate roast");
  }
};
