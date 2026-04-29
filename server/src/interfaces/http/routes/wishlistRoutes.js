import { Router } from "express";
import { wishlistController } from "../../controllers/wishlistController.js";

export function wishlistRoutes(container) {
  const router = Router();

  router.get("/", wishlistController.list(container));
  router.get("/cron/check-matches", async (_req, res, next) => {
    try {
      const results = await container.checkWishlists.execute();
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  });

  return router;
}