import { createClient } from '@supabase/supabase-js';

export class SupabaseInventoryRepository {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async save(inventoryData) {
    const { data, error } = await this.supabase
      .from('inventory')
      .insert(inventoryData)
      .select();

    if (error) throw new Error(`Supabase Save Error: ${error.message}`);
    return data;
  }

  async findByItemName(name) {
    // Basic text search for Merkato items
    const { data, error } = await this.supabase
      .from('inventory')
      .select('*, wholesalers(name, tera, shop_number)')
      .ilike('item_name', `%${name}%`)
      .eq('is_available', true);

    if (error) throw new Error(`Supabase Query Error: ${error.message}`);
    return data;
  }
  async searchInventory({ product, maxPrice, teraPreference }) {
    let query = this.supabase
      .from('inventory')
      .select(`
        item_name,
        unit_price,
        quantity,
        wholesalers (
          name,
          tera,
          shop_number
        )
      `)
      .ilike('item_name', `%${product}%`) // Search for product name
      .eq('is_available', true);

    // Apply optional filters if Gemini extracted them
    if (maxPrice) {
      query = query.lte('unit_price', maxPrice);
    }

    if (teraPreference) {
      // Joins can be filtered using the dot notation in Supabase
      query = query.eq('wholesalers.tera', teraPreference);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Search failed: ${error.message}`);
    
    // Filter out results where the join failed (e.g., location didn't match)
    return data.filter(item => item.wholesalers !== null);
  }
}