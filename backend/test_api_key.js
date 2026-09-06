const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testAPIKey() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log("❌ No API key found in environment variables");
        return;
    }

    console.log(`API Key found: ${apiKey.substring(0, 10)}...`);
    console.log(`API Key length: ${apiKey.length}`);

    // The Google AI SDK doesn't have a direct "list models" endpoint
    // Let's try a simple generation with different model names
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "models/gemini-pro",
        "models/gemini-1.5-flash"
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`\nTesting: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}...`);
            break; // Found a working model
        } catch (error) {
            console.log(`❌ ${modelName} failed: ${error.message}`);
        }
    }
}

testAPIKey();
