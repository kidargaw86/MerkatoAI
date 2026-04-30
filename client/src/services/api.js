import axios from 'axios';

// Default `/api` uses the CRA dev-server proxy to the API (same origin, no CORS).
// Supports both CRA (`REACT_APP_*`) and Vite (`VITE_*`) env styles.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory-specific services
export const inventoryService = {
  /**
   * Sends raw text or image data to the backend for Gemini to process.
   * @param {string} text - The messy Merkato trade notes.
   */
  extractInventory: async (text) => {
    const response = await api.post('inventory/extract', { text });
    return response.data;
  },

  /**
   * Finalizes the AI-parsed data and saves it to Supabase.
   * @param {Array} items - The confirmed list of inventory items.
   */
  saveInventory: async ({ items, wholesalerId }) => {
    const response = await api.post('inventory/save', { items, wholesalerId });
    return response.data;
  },

  /**
   * Fetches the current live inventory list.
   */
  getInventory: async () => {
    const response = await api.get('inventory');
    return response.data;
  }
};

// Real-time / Dashboard services
export const dashboardService = {
  getLiveFeed: async () => {
    const response = await api.get('feed');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('stats');
    return response.data;
  }
};

export default api;