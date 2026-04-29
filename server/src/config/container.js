import { GeminiAdapter } from "../infrastructure/ai/geminiAdapter.js";
import { TelegramAdapter } from "../infrastructure/messaging/telegramAdapter.js";
import { SupabaseInventoryRepository } from "../infrastructure/persistence/supabaseInventoryRepo.js";
import { ProcessInventoryUpload } from "../domain/useCases/processInventoryUpload.js";

// 1. Initialize Infrastructure (Adapters)
const aiService = new GeminiAdapter(process.env.GEMINI_API_KEY);
const messagingService = new TelegramAdapter(process.env.TELEGRAM_BOT_TOKEN);
const inventoryRepo = new SupabaseInventoryRepository();

// 2. Initialize Domain (Use Cases) with Injected Dependencies
const processInventoryUpload = new ProcessInventoryUpload(inventoryRepo, aiService);

// 3. Export as a single object
export const container = {
  aiService,
  messagingService,
  inventoryRepo,
  processInventoryUpload,
};