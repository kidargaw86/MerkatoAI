export class CheckWishlists {
  /**
   * @param {IWishlistRepository} wishlistRepo
   * @param {IInventoryRepository} inventoryRepo
   * @param {NotifyBuyer} notifyBuyerUseCase - Injecting a Use Case into another Use Case
   */
  constructor(wishlistRepo, inventoryRepo, notifyBuyerUseCase) {
    this.wishlistRepo = wishlistRepo;
    this.inventoryRepo = inventoryRepo;
    this.notifyBuyerUseCase = notifyBuyerUseCase;
  }

  /**
   * Main logic to find matches and trigger notifications
   */
  async execute() {
    console.log("🔍 Starting Wishlist Match Engine...");

    // 1. Get all active wishlists from the database
    const activeWishlists = await this.wishlistRepo.findAllActive();

    const results = {
      processed: activeWishlists.length,
      matchesFound: 0,
    };

    for (const wishlist of activeWishlists) {
      // 2. Search inventory for each wishlist item
      // We use the existing search logic in the Repo
      const matches = await this.inventoryRepo.searchInventory({
        product: wishlist.item_name,
        maxPrice: wishlist.max_price,
        teraPreference: wishlist.tera_preference
      });

      if (matches.length > 0) {
        // 3. For every match, trigger the NotifyBuyer Use Case
        // We only notify for the best/first match to avoid spamming
        const bestMatch = matches[0];

        await this.notifyBuyerUseCase.execute(
          { telegram_id: wishlist.buyer_id },
          bestMatch
        );

        // 4. Mark wishlist as "notified" so we don't send the same alert tomorrow
        await this.wishlistRepo.markAsNotified(wishlist.id);
        results.matchesFound++;
      }
    }

    return results;
  }
}