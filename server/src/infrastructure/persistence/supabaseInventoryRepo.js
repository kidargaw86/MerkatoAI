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
  async search({ product, maxPrice, teraPreference }) {
    let query = this.supabase
      .from('inventory')
      .select(`
        *,
        wholesalers (name, tera, shop_number)
      `)
      .ilike('item_name', `%${product}%`)
      .eq('is_available', true);

    if (maxPrice) {
      query = query.lte('unit_price', maxPrice);
    }

    // If the buyer prefers a specific Tera (e.g. Shema Tera)
    if (teraPreference) {
      // We filter based on the joined wholesalers table
      query = query.filter('wholesalers.tera', 'ilike', `%${teraPreference}%`);
    }

    const { data, error } = await query.order('unit_price', { ascending: true });

    if (error) {
      console.error("Supabase Query Error:", error);
      return []; // Return empty array so .length doesn't crash
    }

    return data || [];
  }
}