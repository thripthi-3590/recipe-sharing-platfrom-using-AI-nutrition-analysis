const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("GEMINI_API_KEY is missing");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("test");
            const response = await result.response;
            console.log(`Success with ${modelName}:`, response.text());
            return; // Exit if one succeeds
        } catch (error) {
            console.log(`Failed with ${modelName}:`, error.message);
            if (error.status) console.log(`Status: ${error.status}`);
        }
    }
}

listModels();
