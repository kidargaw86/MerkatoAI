/**
 * Single dev/test wholesaler id for all extraction flows unless overridden in the request.
 * Order: explicit body/param → DEFAULT_WHOLESALER_ID → TEST_WHOLESALER_ID.
 */
export function resolveWholesalerId(explicit) {
  const raw = explicit != null ? String(explicit).trim() : "";
  if (raw) return raw;
  const fromEnv = (process.env.DEFAULT_WHOLESALER_ID || process.env.TEST_WHOLESALER_ID || "").trim();
  return fromEnv || null;
}
