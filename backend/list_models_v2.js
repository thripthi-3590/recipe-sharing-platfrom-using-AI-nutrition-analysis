const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listAllModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("API Key missing");
        return;
    }

    try {
        // Since listModels might be tricky in the standard SDK without more imports, 
        // I will just try a few known good ones and catch errors properly.
        const genAI = new GoogleGenerativeAI(key);

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

        for (const modelName of models) {
            try {
                console.log(`Testing ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("test");
                console.log(`Success with ${modelName}:`, await result.response.text());
                return; // Stop if one works
            } catch (e) {
                console.log(`Failed with ${modelName}:`, e.message);
            }
        }
    } catch (error) {
        console.error("General Failure:", error);
    }
}

listAllModels();
