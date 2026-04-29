export class NotifyBuyer {
  /**
   * @param {IMessagingService} messagingService - Port for Telegram/WhatsApp
   */
  constructor(messagingService) {
    this.messagingService = messagingService;
  }

  /**
   * Sends a structured alert to a buyer when a wishlist item is found
   * @param {object} buyer - Buyer entity with telegram_id
   * @param {object} item - The matched inventory item
   */
  async execute(buyer, item) {
    const message = `
🌟 <b>Wishlist Match Found!</b> 🌟

The item you were looking for is now available:
<b>Item:</b> ${item.item_name}
<b>Price:</b> ${item.unit_price} ETB
<b>Location:</b> ${item.wholesalers.tera} (Shop #${item.wholesalers.shop_number})

<i>Reply to this message to get directions to the shop.</i>
    `;

    // The domain logic doesn't know this is Telegram. 
    // It just uses the port's contract.
    return await this.messagingService.sendMessage(buyer.telegram_id, message);
  }
}