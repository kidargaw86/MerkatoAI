import { Router } from "express";
import { inventoryController } from "../../controllers/inventoryController.js";

export function inventoryRoutes(container) {
  const router = Router();
  router.post("/upload", inventoryController.upload(container));
  return router;
}
