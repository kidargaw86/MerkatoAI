import { IWishlistRepository } from "../../domain/ports/IWishlistRepository.js";

export class SupabaseWishlistRepo extends IWishlistRepository {
  constructor(supabaseClient) {
    super();
    this.supabase = supabaseClient;
  }

  async findByBuyerId(buyerId) {
    const { data, error } = await this.supabase
      .from("wishlists")
      .select("*")
      .eq("buyer_id", String(buyerId))
      .eq("is_active", true)
      .order("id", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findMatches(inventoryItem) {
    let query = this.supabase
      .from('wishlists')
      .select('*')
      .eq('is_active', true)
      .is('last_notified_at', null)
      .ilike('item_name', `%${inventoryItem.item_name}%`);

    if (inventoryItem.unit_price) {
      query = query.gte('max_price', inventoryItem.unit_price);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async findAllActive() {
    const { data, error } = await this.supabase
      .from('wishlists')
      .select('*')
      .eq('is_active', true)
      .is('last_notified_at', null); // Only get those not yet alerted

    if (error) throw error;
    return data;
  }

  async markAsNotified(id) {
    await this.supabase
      .from('wishlists')
      .update({ last_notified_at: new Date() })
      .eq('id', id);
  }
  async save(wishlist) {
    const { data, error } = await this.supabase
      .from('wishlists')
      .insert(wishlist);
    if (error) throw new Error(`Supabase Insert Error: ${error.message}`);
    return data;
  }
}