import { Telegraf } from "telegraf";
import { resolveWholesalerId } from "../../config/resolveWholesalerId.js";

function buyerKey(ctx) {
  return String(ctx.from?.id ?? "");
}

export const createTelegramBot = (container) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN not found. Bot starting skipped.");
    return null;
  }

  const bot = new Telegraf(token);

  bot.start(async (ctx) => {
    await ctx.reply(
      "👋 MerkatoAI — wholesale inventory concierge.\n\n" +
        "Send a message to search stock (e.g. “LED bulb under 80 birr”).\n" +
        "Commands: /wishlist — your list · /add <item> — save a wish · /help"
    );
  });

  bot.help(async (ctx) => {
    await ctx.reply(
      "📌 Commands\n" +
        "/wishlist — show your active wishlist items\n" +
        "/add <product> — add something to your wishlist\n" +
        "Inventory: … — (wholesalers) paste stock notes after this prefix\n\n" +
        "Or just type what you’re looking for to search live inventory."
    );
  });

  bot.command("wishlist", async (ctx) => {
    try {
      const rows = await container.wishlistRepo.findByBuyerId(buyerKey(ctx));
      if (!rows.length) {
        await ctx.reply("Your wishlist is empty. Use /add <item> to add one.");
        return;
      }
      const lines = rows
        .slice(0, 20)
        .map((r, i) => `${i + 1}. ${r.item_name}${r.max_price != null ? ` (max ${r.max_price} ETB)` : ""}`)
        .join("\n");
      await ctx.reply(`🔔 Your wishlist:\n\n${lines}`);
    } catch (err) {
      await ctx.reply(`❌ Could not load wishlist: ${err.message}`);
    }
  });

  bot.command("add", async (ctx) => {
    try {
      const text = (ctx.message?.text || "")
        .replace(/^\/add(?:@\w+)?\s*/i, "")
        .trim();
      if (!text) {
        await ctx.reply('Usage: /add <what you want>\nExample: /add Samsung charger');
        return;
      }
      await container.addToWishlist.execute({
        telegramId: buyerKey(ctx),
        itemName: text
      });
      await ctx.reply(`✅ Saved “${text}” to your wishlist. I’ll notify you when it shows up in Merkato.`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  });

  // --- Wholesaler flow ---
  bot.hears(/^Inventory:/i, async (ctx) => {
    const rawText = ctx.message.text.replace(/^Inventory:/i, "").trim();
    const wholesalerId = resolveWholesalerId(null);
    if (!wholesalerId) {
      await ctx.reply(
        "❌ Wholesaler id is not configured. Set DEFAULT_WHOLESALER_ID or TEST_WHOLESALER_ID on the server."
      );
      return;
    }

    try {
      await ctx.reply("⏳ Processing inventory update...");
      const result = await container.processInventoryUpload.execute(rawText, wholesalerId);
      await ctx.reply(`✅ Added ${result.data.length} items to your shop!`);
    } catch (err) {
      await ctx.reply(`❌ Error: ${err.message}`);
    }
  });

  // --- Buyer search (everything else that is text, not a command) ---
  bot.on("text", async (ctx) => {
    const t = ctx.message.text || "";
    if (t.startsWith("/")) return;

    try {
      const output = await container.handleBuyerQuery.execute(ctx.message.text);

      if (output.totalFound > 0) {
        let response = `🔍 Found ${output.totalFound} items:\n\n`;
        output.results.forEach((item) => {
          response += `📦 ${item.item_name}\n💰 ${item.unit_price} ETB\n📍 ${item.wholesalers?.name ?? "?"} (${item.wholesalers?.tera ?? "?"})\n---\n`;
        });
        await ctx.reply(response);
      } else {
        const itemName = output.intent?.product || ctx.message.text;
        await container.addToWishlist.execute({
          telegramId: buyerKey(ctx),
          itemName,
          maxPrice: output.intent?.maxPrice ?? null,
          teraPreference: output.intent?.teraPreference ?? null
        });
        await ctx.reply(
          `🔔 I couldn't find "${itemName}" right now, so I added it to your wishlist. I'll notify you when it appears.`
        );
      }
    } catch (err) {
      console.error("Telegram buyer search failed:", err);
      await ctx.reply("⚠️ I'm having trouble searching right now.");
    }
  });

  return bot;
};
