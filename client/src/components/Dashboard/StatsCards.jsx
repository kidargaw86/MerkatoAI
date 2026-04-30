import { useDashboardStats } from "../../hooks/useDashboardStats.js";

export default function StatsCards() {
  const { stats, loading, error } = useDashboardStats();

  const fmt = (n) => (loading && n == null ? "…" : n ?? 0);

  return (
    <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        Merchants: <span className="font-semibold">{fmt(stats.merchants)}</span>
        <p className="mt-1 text-xs text-slate-500">Wholesalers with at least one inventory row</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        Items: <span className="font-semibold">{fmt(stats.items)}</span>
        <p className="mt-1 text-xs text-slate-500">Total inventory rows</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        Alerts: <span className="font-semibold">{fmt(stats.alerts)}</span>
        <p className="mt-1 text-xs text-slate-500">Active wishlists waiting for a match</p>
      </div>
      {error && (
        <p className="col-span-full text-sm text-amber-600">{error}</p>
      )}
    </section>
  );
}
