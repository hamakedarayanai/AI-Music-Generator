
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { GeneratedMusic, ImageFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const musicSchema = {
  type: Type.OBJECT,
  properties: {
    genre: { 
      type: Type.STRING, 
      description: "e.g., 'Ambient Lo-fi', 'Uptempo Electronic', 'Cinematic Orchestral'" 
    },
    mood: { 
      type: Type.STRING, 
      description: "e.g., 'Relaxing and introspective', 'Energetic and motivational', 'Melancholic'" 
    },
    tempo: { 
      type: Type.INTEGER, 
      description: "Beats per minute (BPM), e.g., 80" 
    },
    key: { 
      type: Type.STRING, 
      description: "Musical key, e.g., 'C Minor'" 
    },
    instruments: {
      type: Type.ARRAY,
      items: { 
        type: Type.STRING,
      },
      description: "An array of primary instruments, e.g., ['Piano', 'Synth Pad', '808 Drums']"
    },
    description: { 
      type: Type.STRING, 
      description: "A one or two-sentence creative description of the track." 
    },
  },
  required: ["genre", "mood", "tempo", "key", "instruments", "description"],
};


export const generateMusicDescription = async (prompt: string, image: ImageFile | null): Promise<GeneratedMusic> => {
  const promptParts = [];

  const systemPrompt = `Analyze the following user prompt${image ? ' and image' : ''} to envision a unique music track.
Based on the mood, theme, and style, generate a detailed description of the music.

User Prompt: "${prompt}"

Your response MUST be a valid JSON object that strictly adheres to the provided schema. Do not add any text or markdown formatting before or after the JSON object.
`;

  promptParts.push({ text: systemPrompt });

  if (image) {
    promptParts.push({
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType,
      },
    });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: promptParts },
    config: {
        responseMimeType: 'application/json',
        responseSchema: musicSchema
    }
  });

  const text = response.text.trim();
  
  try {
    const musicData = JSON.parse(text);
    return musicData as GeneratedMusic;
  } catch (error) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Could not parse the generated music data.");
  }
};
