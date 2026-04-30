/**
 * Exactly one Telegram ingress path should be active per bot token:
 * - "polling" → Telegraf long-polling (good for local dev)
 * - "webhook" → only POST /api/webhook/telegram (production HTTPS URL)
 */
export function getTelegramMode() {
  const raw = (process.env.TELEGRAM_MODE || "polling").trim().toLowerCase();
  if (raw === "webhook" || raw === "polling") return raw;
  console.warn(`⚠️ TELEGRAM_MODE="${process.env.TELEGRAM_MODE}" is invalid; using polling.`);
  return "polling";
}

export function isWebhookMode() {
  return getTelegramMode() === "webhook";
}
