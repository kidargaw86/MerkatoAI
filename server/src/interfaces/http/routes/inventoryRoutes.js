import { Router } from "express";
import { uploadInventory } from "../../controllers/inventoryController.js";

export function inventoryRoutes(_container) {
  const router = Router();
  router.post("/upload", uploadInventory);
  return router;
}
