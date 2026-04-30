import { useCallback, useEffect, useState } from "react";
import { dashboardService } from "../services/api.js";

export function useDashboardStats() {
  const [stats, setStats] = useState({ merchants: null, items: null, alerts: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await dashboardService.getStats();
      setStats({
        merchants: data.merchants ?? 0,
        items: data.items ?? 0,
        alerts: data.alerts ?? 0
      });
    } catch (e) {
      setError(e.message || "Stats unavailable");
      setStats({ merchants: 0, items: 0, alerts: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
