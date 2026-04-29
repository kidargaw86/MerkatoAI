// test-upload.js
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

async function testInventoryFeature() {
    const { container } = await import('../src/config/container.js');
    console.log("🚀 Starting Feature Test: Inventory Digitization...");

    const rawInput = "I have 500 pieces of LED bulbs 9W for 85 birr each at Shema Tera shop number 42";
    const wholesalerId = "979bad94-37ed-43be-9345-255c0fc96742"; // Get a real UUID from your wholesalers table

    try {
        const result = await container.processInventoryUpload.execute(rawInput, wholesalerId);

        console.log("✅ Success!");
        console.log("Extracted & Saved:", JSON.stringify(result.data, null, 2));
    } catch (error) {
        console.error("❌ Test Failed:", error.message);
    }
}

testInventoryFeature();