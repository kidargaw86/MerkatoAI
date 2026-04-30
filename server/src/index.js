import "dotenv/config";
import { container } from "./config/container.js";
import { createHttpServer } from "./interfaces/http/server.js";
import { createTelegramBot } from "./interfaces/telegram/bot.js";
import { getTelegramMode } from "./config/telegramMode.js";

const app = createHttpServer(container);
const port = Number(process.env.PORT || 4000);

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the other process or set PORT in server/.env.`
    );
    console.error(`Hint: lsof -nP -iTCP:${port} -sTCP:LISTEN`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

const telegramMode = getTelegramMode();

/** Telegraf polling bot — only when not using Telegram webhook delivery */
let bot = null;
if (telegramMode === "webhook") {
  console.log(
    "📩 TELEGRAM_MODE=webhook → Telegraf polling is OFF. Telegram must call POST /api/webhook/telegram (setWebhook on your public HTTPS URL)."
  );
} else {
  bot = createTelegramBot(container);
  if (bot) {
    bot
      .launch()
      .then(() => console.log("🤖 Telegram Bot polling is live (TELEGRAM_MODE=polling)"))
      .catch((err) => console.error("❌ Bot launch failed:", err));
  }
}

process.once("SIGINT", () => {
  server.close();
  bot?.stop("SIGINT");
});
process.once("SIGTERM", () => {
  server.close();
  bot?.stop("SIGTERM");
});
