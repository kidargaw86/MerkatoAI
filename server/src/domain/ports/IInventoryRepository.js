/**
 * @interface IInventoryRepository
 * Domain defines persistence needs, infrastructure implements with Supabase
 */

export class IInventoryRepository {
  async save(items) {
    throw new Error("Method 'save()' must be implemented.");
  }

  async search(filters) {
    throw new Error("Method 'search()' must be implemented.");
  }
}