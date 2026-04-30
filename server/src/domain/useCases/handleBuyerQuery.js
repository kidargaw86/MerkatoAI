export class HandleBuyerQuery {
  /**
   * @param {IAIService} aiService - Port for Intent Parsing
   * @param {IInventoryRepository} inventoryRepo - Port for Database Search
   */
  constructor(aiService, inventoryRepo) {
    this.aiService = aiService;
    this.inventoryRepo = inventoryRepo;
  }

  /**
   * Executes the search logic
   * @param {string} rawMessage - The text sent by the buyer on Telegram
   */
  async execute(rawMessage) {
    if (!rawMessage) throw new Error("Empty message received.");

    // 1) Parse intent with AI. If AI is unavailable, degrade gracefully to text search.
    let intent;
    try {
      intent = await this.aiService.parseBuyerIntent(rawMessage);
    } catch (error) {
      intent = {
        product: rawMessage.trim(),
        maxPrice: null,
        quantity: null,
        teraPreference: null
      };
    }
    if (!intent?.product || typeof intent.product !== "string") {
      intent = {
        ...intent,
        product: rawMessage.trim()
      };
    }

    // 2) Query the repository using parsed/fallback intent.
    const searchResults = await this.inventoryRepo.search({
      product: intent.product,
      maxPrice: intent.maxPrice,
      teraPreference: intent.teraPreference
    });

    // 3. Return a clean DTO (Data Transfer Object) for the Telegram Controller
    return {
      intent,
      results: searchResults,
      totalFound: searchResults.length,
      shouldSuggestWishlist: searchResults.length === 0,
      suggestionMessage:
        searchResults.length === 0
          ? `I couldn't find ${intent.product} right now. Want me to notify you when it arrives in Merkato?`
          : null
    };
  }
}