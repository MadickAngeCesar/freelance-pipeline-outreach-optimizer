import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Gemini features will be unavailable.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

// Check if API is available
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString()
  });
});

// API route 1: Generate custom outreach pitch
app.post("/api/generate-outreach", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini AI is not configured. Please add GEMINI_API_KEY to secrets in the Settings menu." });
  }

  const { lead, sequenceName, stepType, stepBodyTemplate, subjectTemplate } = req.body;

  if (!lead) {
    return res.status(400).json({ error: "Lead information is required." });
  }

  try {
    const prompt = `
      You are an expert cold outreach specialist and highly successful tech freelancer.
      Your task is to personalize a cold outreach message (step of the sequence "${sequenceName || 'Cold Pitch'}") for a high-value freelance prospect.

      PROSPECT INFORMATION:
      - Company Name: ${lead.companyName}
      - Contact Person: ${lead.contactPerson}
      - Website: ${lead.website || 'Not specified'}
      - Target Tech Stack: ${lead.techStack || 'Not specified'}
      - Source: ${lead.source || 'Direct'}
      - Context/Notes: ${lead.notes || 'None'}
      - Primary Pain Points: ${lead.painPoints || 'None'}

      OUTREACH STEP DETAILS:
      - Channel: ${stepType}
      - Subject Line Template (if email): ${subjectTemplate || ''}
      - Body Message Template: "${stepBodyTemplate}"

      INSTRUCTIONS:
      1. Personalize the Body Message Template to fit this specific lead. Replace variables like {{contactPerson}} or {{companyName}} with actual prospect data.
      2. If details (like exact website issues or pain points) are mentioned in notes or pain points, seamlessly weave them in to make the email sound highly researched and bespoke, NOT copy-pasted.
      3. Keep the tone professional, friendly, outcome-focused, and low-pressure. Keep it concise. Busy founders hate long emails.
      4. If subjectTemplate is provided, personalize it as well.
      5. Provide a constructive 2-sentence optimization tip specifically for this lead's pitch.
      6. Provide a "Persuasion Score" from 0 to 100 on how likely this pitch is to get a reply.

      Generate a JSON response conforming strictly to this format:
      {
        "customizedText": "The fully personalized body text",
        "customizedSubject": "The personalized subject line (null if not email channel)",
        "score": 85,
        "optimisationTip": "A useful, actionable tip to increase response rates for this prospect."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customizedText: { type: Type.STRING },
            customizedSubject: { type: Type.STRING },
            score: { type: Type.INTEGER },
            optimisationTip: { type: Type.STRING }
          },
          required: ["customizedText", "score", "optimisationTip"]
        }
      }
    });

    const resultText = response.text;
    res.json(JSON.parse(resultText || "{}"));
  } catch (error: any) {
    console.error("Error generating customized outreach:", error);
    res.status(500).json({ error: error.message || "Failed to generate outreach pitch." });
  }
});

// API route 2: Optimize Outreach Pitches
app.post("/api/optimize-outreach", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini AI is not configured. Please add GEMINI_API_KEY to secrets." });
  }

  const { pitch, niche } = req.body;

  if (!pitch) {
    return res.status(400).json({ error: "Pitch text is required." });
  }

  try {
    const prompt = `
      You are an elite copywriting coach and CRM conversion optimizer.
      Analyze this cold outreach pitch designed for the niche "${niche || 'General Freelancing'}":

      USER'S OUTREACH PITCH:
      """
      ${pitch}
      """

      INSTRUCTIONS:
      1. Critique the pitch. Evaluate its:
         - Subject Line (if it has one)
         - Hook (first 2 sentences - must be about them, not about the sender)
         - Value Proposition (is the offer clear, outcome-focused?)
         - Social Proof/Credibility
         - Call to Action (is it low friction? e.g., "open to a chat?" vs "book a 1-hour meeting")
         - Length and Formatting (should be under 150 words, clean paragraphs)
      2. Provide a Persuasion Score from 0 to 100.
      3. Rewrite the pitch into an alternative highly-optimized version (maintaining the user's core offer but improving hooks, readability, and brevity).
      4. List 3 key actionable critique points.

      Generate a JSON response conforming strictly to this format:
      {
        "score": 72,
        "critiquePoints": [
          "Critique point 1",
          "Critique point 2",
          "Critique point 3"
        ],
        "optimizedVersion": "The rewritten highly optimized pitch text",
        "subjectSuggestion": "A compelling, high-open-rate subject line"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            critiquePoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            optimizedVersion: { type: Type.STRING },
            subjectSuggestion: { type: Type.STRING }
          },
          required: ["score", "critiquePoints", "optimizedVersion"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error optimizing pitch:", error);
    res.status(500).json({ error: error.message || "Failed to optimize pitch." });
  }
});

// API route 3: Recommend Freelance Niches based on skills
app.post("/api/recommend-niches", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini AI is not configured. Please add GEMINI_API_KEY to secrets." });
  }

  const { skills } = req.body;

  if (!skills) {
    return res.status(400).json({ error: "Skills description is required." });
  }

  try {
    const prompt = `
      You are a strategic freelance business advisor who helps technical developers land high-paying contracts.
      Based on the developer's skill set: "${skills}", recommend 3 high-paying, high-opportunity freelance niches that they should target for cold outreach.

      For each niche, specify:
      1. Niche Name
      2. Niche Opportunity (Why this niche is profitable now)
      3. Typical Niche Pain Points (What software or business problems do they have that can be solved with these skills?)
      4. Cold Outreach Angle (The exact angle or offer to pitch them, e.g., "Performance Speedup", "SaaS Automation", "Custom Dashboard")

      Generate a JSON response conforming strictly to this format:
      {
        "niches": [
          {
            "name": "Niche Name 1",
            "opportunity": "Explanation of opportunity",
            "painPoints": "Detailed description of pain points",
            "angle": "Direct cold outreach angle or offer"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            niches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  opportunity: { type: Type.STRING },
                  painPoints: { type: Type.STRING },
                  angle: { type: Type.STRING }
                },
                required: ["name", "opportunity", "painPoints", "angle"]
              }
            }
          },
          required: ["niches"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error recommending niches:", error);
    res.status(500).json({ error: error.message || "Failed to recommend niches." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
