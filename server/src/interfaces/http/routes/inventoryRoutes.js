import { Router } from "express";
import {
  extractInventoryPreview,
  listInventory,
  saveInventoryConfirmed,
  uploadInventory
} from "../../controllers/inventoryController.js";

export function inventoryRoutes(_container) {
  const router = Router();
  router.get("/", listInventory);
  router.post("/", uploadInventory);
  router.post("/upload", uploadInventory);
  router.post("/extract", extractInventoryPreview);
  router.post("/save", saveInventoryConfirmed);
  return router;
}
