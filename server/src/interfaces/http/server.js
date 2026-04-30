import express from "express";
import { webhookRoutes } from "./routes/webhookRoutes.js";
import { inventoryRoutes } from "./routes/inventoryRoutes.js";
import { wishlistRoutes } from "./routes/wishlistRoutes.js";
import { feedRoutes } from "./routes/feedRoutes.js";
import { statsRoutes } from "./routes/statsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createHttpServer(container) {
  const app = express();
  app.use(express.json());

  app.use("/api/webhook", webhookRoutes(container));
  app.use("/api/inventory", inventoryRoutes(container));
  app.use("/api/wishlist", wishlistRoutes(container));
  app.use("/api/feed", feedRoutes(container));
  app.use("/api/stats", statsRoutes(container));

  app.use(errorHandler);
  return app;
}
