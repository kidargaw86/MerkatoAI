/**
 * @interface IAIService
 * Contract for AI/LLM operations. Domain defines WHAT we need,
 * infrastructure decides HOW (Gemini or any other LLM)
 */

export class IAIService {
  /**
   * Extract structured inventory from unstructured text/image
   * @param {string} rawInput
   * @returns {Promise<{itemName: string, unitPrice: number, quantity: number, teraLocation: string}[]>}
   */
  async extractInventory(rawInput) {
    throw new Error('Method not implemented');
  }

  /**
   * Parse buyer intent from natural language query
   * @param {string} message
   * @returns {Promise<{product: string, maxPrice: number|null, quantity: number|null, teraPreference: string|null}>}
   */
  async parseBuyerIntent(message) {
    throw new Error('Method not implemented');
  }
}