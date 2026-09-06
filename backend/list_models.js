const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return;

    try {
        const genAI = new GoogleGenerativeAI(key);
        // The SDK might not have listModels exposed directly the way I expect, 
        // but let's try gemini-pro which is very common.
        // Also checking gemini-1.5-flash-latest.

        console.log("Trying gemini-1.5-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("High five!");
        console.log("Success with gemini-1.5-flash-latest:", result.response.text());
    } catch (error) {
        console.log("Failed with gemini-1.5-flash-latest:", error.message);
        try {
            console.log("Trying gemini-pro...");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("High five!");
            console.log("Success with gemini-pro:", result.response.text());
        } catch (err2) {
            console.log("Failed with gemini-pro:", err2.message);
        }
    }
}

listModels();
