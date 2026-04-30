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

  async listRecent(limit = 100) {
    const { data, error } = await this.supabase
      .from("inventory")
      .select(
        `
        *,
        wholesalers (name, tera, shop_number)
      `
      )
      .order("id", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase listRecent Error:", error);
      return [];
    }
    return data || [];
  }

  /**
   * Counts for dashboard: distinct wholesalers with inventory rows, total items, pending wishlist alerts.
   */
  async getDashboardStats() {
    const { count: itemCount, error: itemErr } = await this.supabase
      .from("inventory")
      .select("*", { count: "exact", head: true });

    if (itemErr) {
      console.error("getDashboardStats items:", itemErr);
    }

    const { data: wholesalerRows, error: wErr } = await this.supabase
      .from("inventory")
      .select("wholesaler_id");

    if (wErr) {
      console.error("getDashboardStats wholesaler_ids:", wErr);
    }

    const merchantCount = new Set(
      (wholesalerRows || []).map((r) => r.wholesaler_id).filter(Boolean)
    ).size;

    const { count: alertCount, error: aErr } = await this.supabase
      .from("wishlists")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .is("last_notified_at", null);

    if (aErr) {
      console.error("getDashboardStats wishlists:", aErr);
    }

    return {
      merchants: merchantCount,
      items: itemCount ?? 0,
      alerts: alertCount ?? 0
    };
  }
}