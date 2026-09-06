const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testFlash() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing with gemini-1.5-flash...\n");

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Create a simple recipe for pasta. Just say the title.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ SUCCESS! AI Response:");
        console.log(text);
        console.log("\n🎉 Real AI is now working! Your recipes will be custom-generated!");

    } catch (error) {
        console.error("❌ ERROR:", error.message);
    }
}

testFlash();
