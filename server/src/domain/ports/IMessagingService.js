/**
 * Interface for Messaging Services.
 * This ensures the domain doesn't depend on Telegram-specific libraries.
 */
export class IMessagingService {
  /**
   * Sends a text message to a user.
   * @param {string} destination - The unique identifier for the recipient (e.g., chat_id).
   * @param {string} text - The message content.
   * @param {object} options - Optional formatting or keyboard metadata.
   */
  async sendMessage(destination, text, options) {
    throw new Error("Method 'sendMessage()' must be implemented.");
  }

  /**
   * Sends a photo or file to a user.
   * @param {string} destination - The recipient identifier.
   * @param {string} fileUrl - URL or path to the media.
   * @param {string} caption - Accompanying text.
   */
  async sendMedia(destination, fileUrl, caption) {
    throw new Error("Method 'sendMedia()' must be implemented.");
  }
}