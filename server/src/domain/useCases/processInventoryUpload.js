import { IAIService } from "../ports/IAIService.js";
import { IInventoryRepository } from "../ports/IInventoryRepository.js";

export class ProcessInventoryUpload {
  /**
   * @param {IAIService} aiService - Port for AI operations
   * @param {IInventoryRepository} inventoryRepo - Port for DB operations
   */
  constructor(inventoryRepo, aiService) {
    this.inventoryRepo = inventoryRepo;
    this.aiService = aiService;
  }

  /**
   * Orchestrates the flow of digitizing merchant notes
   * @param {string} rawText - The messy text from the wholesaler
   * @param {string} wholesalerId - ID of the merchant
   */
  async execute(rawText, wholesalerId) {
    // 1. Validate input
    if (!rawText || !wholesalerId) {
      throw new Error("Missing required data for inventory processing.");
    }

    // 2. Call the AI Port (Gemini Adapter) to structure the data
    // The Use Case doesn't care HOW Gemini does it, just that it returns the expected shape.
    const extractedData = await this.aiService.parseMerchantNotes(rawText);

    // 3. Map the AI result to our Domain Entities and add the Wholesaler ID
    const inventoryEntities = extractedData.items.map(item => ({
      wholesaler_id: wholesalerId,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      unit: item.unit || 'Piece',
      location_override: item.location || null
    }));

    // 4. Save to the Repository Port (Supabase Adapter)
    const savedInventory = await this.inventoryRepo.save(inventoryEntities);

    // 5. Return the result to the Controller
    return {
      success: true,
      count: savedInventory.length,
      data: savedInventory
    };
  }
}