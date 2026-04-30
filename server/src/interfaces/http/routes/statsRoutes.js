import { Router } from "express";
import { getStats } from "../../controllers/statsController.js";

export function statsRoutes(_container) {
  const router = Router();
  router.get("/", getStats);
  return router;
}
