import { container } from '../../config/container.js';

export const uploadInventory = async (req, res, next) => {
  try {
    const { text, wholesalerId } = req.body;

    // Execute the Use Case
    const result = await container.processInventoryUpload.execute(text, wholesalerId);

    return res.status(201).json(result);
  } catch (error) {
    // Pass to your errorHandler middleware
    next(error);
  }
};