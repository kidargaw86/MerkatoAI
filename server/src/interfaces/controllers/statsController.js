import { container } from "../../config/container.js";

export const getStats = async (_req, res, next) => {
  try {
    const stats = await container.inventoryRepo.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
