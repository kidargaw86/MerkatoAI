export const wishlistController = {
  list: (container) => async (_req, res) => {
    const result = await container.services.wishlistService.list();
    res.status(200).json(result);
  }
};
