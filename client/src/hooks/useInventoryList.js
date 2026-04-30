import { useCallback, useEffect, useState } from "react";
import { inventoryService } from "../services/api.js";

function axiosMessage(err) {
  const data = err.response?.data;
  if (typeof data?.error === "string") return data.error;
  if (typeof data === "string") return data;
  return err.message || "Failed to load inventory";
}

export function useInventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      try {
        const data = await inventoryService.getInventory();
        if (!cancelled) setItems(data.items ?? []);
      } catch (e) {
        if (!cancelled) setError(axiosMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    try {
      const data = await inventoryService.getInventory();
      setItems(data.items ?? []);
    } catch (e) {
      setError(axiosMessage(e));
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { items, loading, refreshing, error, refresh };
}
