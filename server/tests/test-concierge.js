import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
const { container } = await import('../src/config/container.js');

async function runConciergeTest() {
    console.log("🛋️ Starting Concierge Test...");

    try {
        // 1. Buyer searches for something rare
        console.log("👤 Buyer searching for 'iPhone 17'...");
        const search = await container.handleBuyerQuery.execute("I need an iPhone 17");

        if (search.totalFound === 0) {
            console.log("📌 No results. Adding to Wishlist...");
            await container.addToWishlist.execute({
                telegramId: "user_123",
                itemName: search.intent.product,
                maxPrice: search.intent.maxPrice
            });
        }

        // 2. Wholesaler later uploads inventory
        console.log("\n🏪 Wholesaler uploading new items...");
        const rawNote = "New Arrival: 5 units of iPhone 17 for 150000 birr";
        const WHolesaler_UUID = "979bad94-37ed-43be-9345-255c0fc96742"; // Use your test merchant ID

        const uploadResult = await container.processInventoryUpload.execute(rawNote, WHolesaler_UUID);

        console.log("✅ Cycle Complete. Check logs for 'Match Found' messages!");

    } catch (err) {
        console.error("❌ Concierge Test Failed:", err.message);
    }
}

runConciergeTest();