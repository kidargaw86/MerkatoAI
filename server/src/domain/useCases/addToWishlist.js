export class AddToWishlist {
  /**
   * @param {IWishlistRepository} wishlistRepo
   */
  constructor(wishlistRepo) {
    this.wishlistRepo = wishlistRepo;
  }

  /**
   * Creates a new wishlist entry for a buyer.
   * @param {object} input
   * @param {string} input.buyerId
   * @param {string} input.itemName
   * @param {number|null} [input.maxPrice]
   * @param {string|null} [input.teraPreference]
   */
  async execute({ buyerId, telegramId, itemName, maxPrice = null, teraPreference = null }) {
    const buyerTelegramId = telegramId || buyerId;
    if (!buyerTelegramId) {
      throw new Error("buyerTelegramId is required");
    }
    if (!itemName) {
      throw new Error("itemName is required");
    }

    const wishlist = {
      buyer_id: buyerTelegramId,
      item_name: itemName,
      max_price: maxPrice,
      tera_preference: teraPreference,
      is_active: true
    };

    const data = await this.wishlistRepo.save(wishlist);
    return { success: true, data };
  }
}
