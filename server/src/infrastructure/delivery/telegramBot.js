import { Telegraf } from 'telegraf';

export class TelegramBot {
    constructor(token, container) {
        this.bot = new Telegraf(token);
        this.container = container;
    }

    init() {
        this.bot.start((ctx) => ctx.reply('Welcome to MerkatoAI! Are you a Buyer or a Wholesaler?'));

        // 1. Handle Wholesaler Uploads (When they send a message starting with "Inventory:")
        this.bot.hears(/^Inventory:/i, async (ctx) => {
            const rawText = ctx.message.text.replace(/^Inventory:/i, '').trim();
            const wholesalerId =
                process.env.DEFAULT_WHOLESALER_ID ||
                process.env.TEST_WHOLESALER_ID ||
                "";
            if (!wholesalerId) {
                ctx.reply("❌ Set DEFAULT_WHOLESALER_ID or TEST_WHOLESALER_ID on the server.");
                return;
            }

            try {
                ctx.reply("⏳ Processing your inventory update...");
                const result = await this.container.processInventoryUpload.execute(rawText, wholesalerId);
                ctx.reply(`✅ Added ${result.data.length} items to your shop!`);
            } catch (err) {
                ctx.reply(`❌ Upload Error: ${err.message}`);
            }
        });

        // 2. Handle Buyer Searches (Everything else)
        this.bot.on('text', async (ctx) => {
            const message = ctx.message.text;

            try {
                const output = await this.container.handleBuyerQuery.execute(message);

                if (output.totalFound > 0) {
                    let response = `🔍 Found ${output.totalFound} items:\n\n`;
                    output.results.forEach(item => {
                        response += `📦 ${item.item_name}\n💰 ${item.unit_price} ETB\n📍 ${item.wholesalers.name} (${item.wholesalers.tera})\n---\n`;
                    });
                    ctx.reply(response);
                } else {
                    // SUGGEST WISHLIST
                    ctx.reply(output.suggestionMessage, {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: "Yes, notify me!", callback_data: `wishlist_${output.intent.product}_${output.intent.maxPrice || ''}` }
                            ]]
                        }
                    });
                }
            } catch (err) {
                ctx.reply("⚠️ Sorry, I had trouble understanding that. Try again?");
            }
        });

        this.bot.launch();
        console.log("🚀 MerkatoAI Bot is live on Telegram!");
    }
}