import { Router } from "express";
import { wishlistController } from "../../controllers/wishlistController.js";

export function wishlistRoutes(container) {
  const router = Router();
  router.get("/", wishlistController.list(container));
  return router;
}
