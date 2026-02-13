
import { GoogleGenAI, Type } from "@google/genai";
import { Fact } from '../types';

export class GeminiService {
  // Fix: Guidelines recommend creating a new instance right before making an API call to ensure it always uses the most up-to-date API key.
  static async generateFacts(prompt: string): Promise<Fact[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short title for the fact" },
              fact: { type: Type.STRING, description: "The self-contained interesting fact in Chinese" },
              icon: { type: Type.STRING, description: "A single emoji representing this fact" }
            },
            required: ["title", "fact", "icon"],
            propertyOrdering: ["title", "fact", "icon"],
          },
        },
      },
    });

    try {
      // Fix: response.text is a getter property, not a method. Access it directly.
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse facts JSON", e);
      return [];
    }
  }

  static async generateImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    // Fix: Properly iterate through candidates and all parts to find the image data as per guidelines.
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  }
}
