import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate word puzzle categories dynamically
app.post("/api/generate-words", async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme || typeof theme !== "string" || theme.trim() === "") {
      res.status(400).json({ error: "Theme string is required." });
      return;
    }

    const ai = getGenAI();
    const prompt = `Generate a word search game themed around: "${theme}". 
    Provide a title/theme name (2-4 words) and a list of 8 to 12 words that fit this theme. 
    Each word must be between 3 and 10 characters long, consist only of English letters (A-Z), and be suitable for a general audience. No spaces or symbols inside the words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeName: {
              type: Type.STRING,
              description: "A beautiful title for the generated theme.",
            },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "8 to 12 themed uppercase words, between 3 and 10 letters.",
            },
          },
          required: ["themeName", "words"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    const parsed = JSON.parse(resultText);
    
    // Normalize words to uppercase, alphanumeric, and filter invalid
    const normalizedWords = (parsed.words || [])
      .map((w: string) => w.toUpperCase().replace(/[^A-Z]/g, ""))
      .filter((w: string) => w.length >= 3 && w.length <= 10);

    res.json({
      themeName: parsed.themeName || theme,
      words: normalizedWords.slice(0, 12),
    });
  } catch (error: any) {
    console.error("Gemini Word Generation Error:", error);
    res.status(500).json({
      error: "Failed to generate theme words",
      details: error.message || error,
    });
  }
});

// Configure Vite middleware for dev or Serve Static Assets in production
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Word Puzzle Server listening on http://localhost:${PORT}`);
  });
}

configureServer().catch((err) => {
  console.error("Error setting up server:", err);
});
