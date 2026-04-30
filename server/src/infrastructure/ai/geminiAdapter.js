import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from '../../domain/ports/IAIService.js';

export class GeminiAdapter extends IAIService {
  constructor(apiKey) {
    super();
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Prefer env-configured model; fallback to a broadly available Flash model.
    // v1beta: use a model id that exists for generateContent (see https://ai.google.dev/gemini-api/docs/models)
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    this.model = this.genAI.getGenerativeModel({
      model: modelName,
      // Force the model to output valid JSON
      generationConfig: { responseMimeType: "application/json" },
    });
  }

  async extractInventory(rawInput) {
    try {
      const textIn = String(rawInput ?? "").trim();
      if (!textIn) return { items: [] };
      if (!process.env.GEMINI_API_KEY?.trim()) {
        throw new Error("GEMINI_API_KEY is not set.");
      }

      const prompt = `
      You are a Merkato Inventory Parser. 
      Target Market: Addis Ababa, Ethiopia.
      Languages: Mixed Amharic and English.
      
      Task: Extract structured items from the input.
      
      Known Teras: Shema Tera, Minalesh Tera, Somale Tera, Arada Tera, Bomb Tera, Dubai Tera.
      
      Input Text: "${textIn.replace(/"/g, '\\"')}"
      
      Output Schema:
      {
        "items": [
          {
            "item_name": "string",
            "unit_price": number,
            "quantity": number,
            "tera_location": "string"
          }
        ]
      }
    `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const normalized = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(normalized);
      } catch {
        throw new Error("Model returned non-JSON response.");
      }
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new Error("Model returned unexpected schema (missing items array).");
      }
      return parsed;
    } catch (error) {
      throw new Error(`Gemini Extraction Error: ${error.message}`);
    }
  }

  async parseBuyerIntent(message) {
    const prompt = `
      You are a Merkato Shopping Intent Parser.
      Extract query parameters from this buyer message: "${message}"
      
      Output Schema:
      {
        "product": "string",
        "maxPrice": number | null,
        "quantity": number | null,
        "teraPreference": "string" | null
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const normalized = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      return JSON.parse(normalized);
    } catch (error) {
      throw new Error(`Gemini Intent Parsing Error: ${error.message}`);
    }
  }
}