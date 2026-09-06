const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listAvailableModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking available models...\n");

    const genAI = new GoogleGenerativeAI(key);

    // Try different model names
    const modelsToTry = [
        "gemini-1.5-pro",
        "gemini-1.5-flash-latest",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Testing: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hi");
            const response = await result.response;
            console.log(`✅ ${modelName} WORKS!`);
            console.log(`Response: ${response.text()}\n`);
            return modelName;
        } catch (error) {
            console.log(`❌ ${modelName} failed: ${error.status || error.message}\n`);
        }
    }

    console.log("No working models found. Your API key might need additional setup.");
}

listAvailableModels();
