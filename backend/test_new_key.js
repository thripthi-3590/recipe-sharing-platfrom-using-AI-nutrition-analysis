const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testNewKey() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing API Key:", key ? `${key.substring(0, 20)}...` : "MISSING");

    if (!key) {
        console.error("❌ No API key found!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("\n🧪 Testing simple generation...");
        const result = await model.generateContent("Say 'Hello, AI is working!' in a friendly way.");
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS! AI Response:");
        console.log(text);
        console.log("\n🎉 Your API key is working perfectly!");

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        if (error.status === 404) {
            console.log("\n💡 Try using 'gemini-1.5-flash' model instead");
        }
    }
}

testNewKey();
