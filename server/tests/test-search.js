import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
const { container } = await import('../src/config/container.js');

async function runSearchTest() {
    console.log("🔍 Starting Feature Test: Buyer Search...");

    const message = "I'm looking for Samsung chargers under 500 birr";

    try {
        const output = await container.handleBuyerQuery.execute(message);

        console.log("🤖 AI Intent Extracted:", output.intent);
        console.log("📦 Results Found:", output.count);

        if (output.count > 0) {
            console.table(output.results.map(r => ({
                Item: r.item_name,
                Price: r.unit_price,
                Shop: r.wholesalers.name,
                Location: `${r.wholesalers.tera} (#${r.wholesalers.shop_number})`
            })));
        } else {
            console.log("❌ No items found matching that description.");
        }
    } catch (err) {
        console.error("❌ Search Failed:", err.message);
    }
}

runSearchTest();