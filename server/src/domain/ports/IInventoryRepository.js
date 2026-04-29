/**
 * @interface IInventoryRepository
 * Domain defines persistence needs, infrastructure implements with Supabase
 */

export class IInventoryRepository {
  async save(inventory) {
    throw new Error('Method not implemented');
  }

  async search({ product, maxPrice, teraPreference, quantity }) {
    throw new Error('Method not implemented');
  }

  async getRecentUploads(hoursBack = 24) {
    throw new Error('Method not implemented');
  }

  async getById(id) {
    throw new Error('Method not implemented');
  }
}