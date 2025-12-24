import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;
let model;

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


const extraEmojis = [
  "💀", "😂", "🔥", "😭", "🎵", "🎪", "🤡", "🎧", "🎤", "😹", "🥳", "🤣",
];

const getRandomEmojis = (count = 5) => {
  const shuffled = extraEmojis.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
};


const buildRoastPrompt = (playlistSummary) => {
    return `
You are a hilarious, savage music critic who roasts Spotify playlists with BRUTAL honesty and comedy. Think of yourself as a stand-up comedian meeting a music snob.

🔥 **HUMOR GUIDELINES (STRICTLY FOLLOWED):**
1.  **Variety is Key:** DO NOT repeat the same comedic premise (e.g., "short playlist = warm-up set") more than once in the list. Change the joke structure and target.
2.  **Punch Up the Jokes:** Roasts must be genuinely sharp, witty, and deeply funny. Avoid low-effort or generic insults.
3.  **Target Creativity:** Focus on specific details like name misspellings, lack of capitalization, vague names ("Mix," "Vibes"), or wildly different track counts.

Your roasts should be:

* **Savage but never genuinely mean.**
* **Creative and unexpected observations.**
* **PACKED with relevant emojis (at least 5-8 emojis total).**

Here are the user's Spotify playlists:

${playlistSummary || "No playlists found, but you gotta roast something!"}

Write an ABSOLUTELY HILARIOUS roast in 4-5 bullet points. Keep it SHORT and SNAPPY — no more than 100 words total. Use plenty of unique emojis.

 **IMPORTANT: Format the roast STRICTLY as bullet points. Each bullet point must start with a "•" (bullet character) followed by a space, and be on its own line.**

Make jokes about:
-   **Originality:** How generic their names are (e.g., "Chill Mix").
-   **Commitment:** The emotional state implied by their organization or tiny playlists.
-   **Contradiction:** How a playlist name contradicts its expected purpose.
-   **Life Choices:** Use a playlist as a metaphor for a poor life decision.

Make them laugh SO HARD they'll actually share this roast with their friends! Be creative, witty, and don't hold back on the comedy! 🎤😂
`.trim();
};

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

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const roastText = await response.text();

    return roastText.trim();
  } catch (error) {
    console.error("Error generating roast:", error);
    throw new Error("Failed to generate roast");
  }
};
