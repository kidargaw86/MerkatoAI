import { GeminiAdapter } from "../infrastructure/ai/geminiAdapter.js";
import { TelegramAdapter } from "../infrastructure/messaging/telegramAdapter.js";
import { SupabaseInventoryRepository } from "../infrastructure/persistence/supabaseInventoryRepo.js";
import { SupabaseWishlistRepo } from "../infrastructure/persistence/supabaseWishlistRepo.js";
import { ProcessInventoryUpload } from "../domain/useCases/processInventoryUpload.js";
import { NotifyBuyer } from "../domain/useCases/notifyBuyer.js";
import { CheckWishlists } from "../domain/useCases/checkWishlists.js";
import { HandleBuyerQuery } from "../domain/useCases/handleBuyerQuery.js";

// 1. Initialize Infrastructure (Adapters)
const aiService = new GeminiAdapter(process.env.GEMINI_API_KEY);
const messagingService = new TelegramAdapter(process.env.TELEGRAM_BOT_TOKEN);
const inventoryRepo = new SupabaseInventoryRepository();
const wishlistRepo = new SupabaseWishlistRepo(inventoryRepo.supabase);

// 2. Initialize Domain (Use Cases) with Injected Dependencies
const processInventoryUpload = new ProcessInventoryUpload(inventoryRepo, aiService);
const notifyBuyer = new NotifyBuyer(messagingService);
const checkWishlists = new CheckWishlists(wishlistRepo, inventoryRepo, notifyBuyer);
const handleBuyerQuery = new HandleBuyerQuery(aiService, inventoryRepo);
// 3. Export as a single object
export const container = {
  aiService,
  messagingService,
  inventoryRepo,
  processInventoryUpload,
  notifyBuyer,
  checkWishlists,
  handleBuyerQuery,
};