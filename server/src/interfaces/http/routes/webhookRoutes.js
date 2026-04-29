import { Router } from "express";
import { handleTelegramWebhook } from "../../controllers/webhookController.js";

export function webhookRoutes(container) {
  const router = Router();
  router.post("/telegram", handleTelegramWebhook(container));
  return router;
}
