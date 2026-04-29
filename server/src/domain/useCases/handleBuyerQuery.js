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

    // 1. Use the AI Port to extract Intent (Product, Price, Location)
    // Your GeminiAdapter.parseBuyerIntent implementation is called here
    const intent = await this.aiService.parseBuyerIntent(rawMessage);

    // 2. Query the Repository Port based on extracted intent
    // We pass the intent object to a repository method that handles filtering
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
      // Logic for "No Results": maybe later we trigger the wishlist use case here
      shouldSuggestWishlist: searchResults.length === 0
    };
  }
}