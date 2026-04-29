import { Router } from "express";

export function feedRoutes() {
  const router = Router();
  router.get("/", (_req, res) => {
    res.json({ items: [] });
  });
  return router;
}
