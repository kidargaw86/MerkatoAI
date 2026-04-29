import axios from 'axios';

// Use an environment variable for the base URL, defaulting to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

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
    const response = await api.post('/inventory/extract', { text });
    return response.data;
  },

  /**
   * Finalizes the AI-parsed data and saves it to Supabase.
   * @param {Array} items - The confirmed list of inventory items.
   */
  saveInventory: async (items) => {
    const response = await api.post('/inventory/save', { items });
    return response.data;
  },

  /**
   * Fetches the current live inventory list.
   */
  getInventory: async () => {
    const response = await api.get('/inventory');
    return response.data;
  }
};

// Real-time / Dashboard services
export const dashboardService = {
  getLiveFeed: async () => {
    const response = await api.get('/feed');
    return response.data;
  }
};

export default api;