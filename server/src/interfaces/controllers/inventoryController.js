import { container } from "../../config/container.js";
import { resolveWholesalerId } from "../../config/resolveWholesalerId.js";

export const listInventory = async (_req, res, next) => {
  try {
    const rows = await container.inventoryRepo.listRecent(100);
    return res.status(200).json({ items: rows });
  } catch (error) {
    next(error);
  }
};

export const extractInventoryPreview = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "text is required" });
    }
    const extractedData = await container.aiService.extractInventory(text);
    return res.status(200).json(extractedData);
  } catch (error) {
    next(error);
  }
};

export const saveInventoryConfirmed = async (req, res, next) => {
  try {
    const { items, wholesalerId: bodyWholesalerId } = req.body;
    const wholesalerId = resolveWholesalerId(bodyWholesalerId);
    if (!wholesalerId) {
      return res.status(400).json({
        error: "wholesalerId is required (pass in body or set DEFAULT_WHOLESALER_ID / TEST_WHOLESALER_ID)"
      });
    }
    if (!items?.length) {
      return res.status(400).json({ error: "items are required" });
    }
    const rows = items.map((item) => ({
      wholesaler_id: wholesalerId,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      unit: item.unit || "Piece",
      location_override: item.location ?? item.location_override ?? null
    }));
    const saved = await container.inventoryRepo.save(rows);
    return res.status(201).json({ success: true, count: saved.length, data: saved });
  } catch (error) {
    next(error);
  }
};

export const uploadInventory = async (req, res, next) => {
  try {
    const { text, wholesalerId: bodyWholesalerId } = req.body;
    const wholesalerId = resolveWholesalerId(bodyWholesalerId);
    if (!wholesalerId) {
      return res.status(400).json({
        error: "wholesalerId is required (pass in body or set DEFAULT_WHOLESALER_ID / TEST_WHOLESALER_ID)"
      });
    }
    const result = await container.processInventoryUpload.execute(text, wholesalerId);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
