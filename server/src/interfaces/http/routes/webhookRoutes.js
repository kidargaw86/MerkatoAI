import { Router } from "express";
import { handleTelegramWebhook } from "../../controllers/webhookController.js";

export function webhookRoutes(_container) {
  const router = Router();
  router.post("/telegram", handleTelegramWebhook);
  return router;
}
