import axios from 'axios';
import { IMessagingService } from '../../domain/ports/IMessagingService.js';

export class TelegramAdapter extends IMessagingService {
  constructor(token) {
    super();
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
  }

  /**
   * Sends a message to a specific Telegram chat ID
   * @param {string} destination - The Telegram Chat ID
   * @param {string} text - The message body
   * @param {object} options - Optional parameters like reply_markup
   */
  async sendMessage(destination, text, options = {}) {
    const url = `${this.baseUrl}/sendMessage`;
    
    try {
      const response = await axios.post(url, {
        chat_id: destination,
        text: text,
        parse_mode: 'HTML', // Allows for bolding and links in MerkatoAI alerts
        ...options
      });

      return response.data;
    } catch (error) {
      // Log the error but don't crash the use case
      console.error('Telegram Send Error:', error.response?.data || error.message);
      throw new Error(`Failed to send Telegram message: ${error.message}`);
    }
  }

  /**
   * Optional: Send a photo (useful for Workflow 1 confirmation or product images)
   */
  async sendPhoto(destination, photoUrl, caption) {
    const url = `${this.baseUrl}/sendPhoto`;
    try {
      await axios.post(url, {
        chat_id: destination,
        photo: photoUrl,
        caption: caption
      });
    } catch (error) {
      console.error('Telegram Photo Error:', error.message);
    }
  }
}