import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from '../../domain/ports/IAIService.js';

export class GeminiAdapter extends IAIService {
  constructor(apiKey) {
    super();
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use a stable model id; "-latest" aliases may not exist on all API versions.
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      // Force the model to output valid JSON
      generationConfig: { responseMimeType: "application/json" },
    });
  }

  async extractInventory(rawInput) {
    const prompt = `
      You are a Merkato Inventory Parser. 
      Target Market: Addis Ababa, Ethiopia.
      Languages: Mixed Amharic and English.
      
      Task: Extract structured items from the input.
      
      Known Teras: Shema Tera, Minalesh Tera, Somale Tera, Arada Tera, Bomb Tera, Dubai Tera.
      
      Input Text: "${rawInput}"
      
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

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      // In Clean Arch, we wrap external errors in our own domain-friendly errors
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
      return JSON.parse(response.text());
    } catch (error) {
      throw new Error(`Gemini Intent Parsing Error: ${error.message}`);
    }
  }
}