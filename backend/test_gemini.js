const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", key ? "Key exists" : "Key MISSING");
    if (!key) return;

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello and return a valid JSON object: { \"message\": \"test\" }");
        const response = await result.response;
        console.log("Response text:", response.text());
    } catch (error) {
        console.error("Gemini Error:", error);
    }
}

testGemini();
