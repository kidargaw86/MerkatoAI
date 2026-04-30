import { container } from '../../config/container.js';

export const handleTelegramWebhook = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.text) return res.sendStatus(200);

    const rawText = message.text;
    const buyerId = message.chat.id.toString();

    const response = await container.handleBuyerQuery.execute(rawText);

    let replyText = "";
    if (response.results.length > 0) {
      replyText = `✅ Found ${response.totalFound} matches for "${response.intent.product}":\n\n`;
      response.results.forEach(item => {
        replyText += `📍 ${item.wholesalers.tera} - ${item.wholesalers.shop_number}\n`;
        replyText += `💰 ${item.unit_price} ETB | 📦 Stock: ${item.quantity}\n\n`;
      });
    } else {
      replyText =
        response.suggestionMessage ||
        `❌ Sorry, I couldn't find any "${response.intent.product}" matching your request right now. Would you like to add it to your /wishlist?`;
    }

    // Call Messaging Port to send the message back (Adapter will be implemented next)
    await container.messagingService.sendMessage(buyerId, replyText);

    res.sendStatus(200); // Always tell Telegram we got the message
  } catch (error) {
    console.error("Webhook Error:", error);
    res.sendStatus(200); // Still send 200 to avoid Telegram retries
  }
};