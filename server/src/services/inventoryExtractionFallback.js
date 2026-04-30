/**
 * Heuristic extraction when Gemini is unavailable (quota/429, etc.).
 * Output shape matches AI schema: { items: [{ item_name, unit_price, quantity, tera_location }] }.
 */
export function fallbackExtractInventory(text) {
  const lines = String(text)
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

  const items = lines.map((line) => {
    const priceMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:birr|etb)?/i);
    const qtyMatch = line.match(/(\d+)\s*(?:pcs?|pieces?|qty|quantity)/i);

    let itemName = line;
    if (priceMatch) itemName = itemName.replace(priceMatch[0], " ");
    if (qtyMatch) itemName = itemName.replace(qtyMatch[0], " ");
    itemName = itemName.replace(/\s+/g, " ").trim();

    return {
      item_name: itemName || line,
      unit_price: priceMatch ? Number(priceMatch[1]) : null,
      quantity: qtyMatch ? Number(qtyMatch[1]) : 1,
      tera_location: null
    };
  });

  return { items };
}
