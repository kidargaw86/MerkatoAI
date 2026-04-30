import { useInventoryList } from "../../hooks/useInventoryList.js";

export default function InventoryList() {
  const { items, loading, refreshing, error, refresh } = useInventoryList();

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Inventory list</h3>
        <button
          type="button"
          onClick={() => refresh()}
          disabled={refreshing}
          className="text-sm text-blue-600 hover:underline disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-slate-500">No rows yet. Save from Digitize above.</p>
      )}
      {!loading && items.length > 0 && (
        <ul className="max-h-64 space-y-2 overflow-auto text-sm">
          {items.map((row) => (
            <li key={row.id} className="border-b border-slate-100 pb-2 last:border-0">
              <span className="font-medium">{row.item_name}</span>
              <span className="text-slate-600">
                {" "}
                — {row.unit_price} ETB × {row.quantity}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
