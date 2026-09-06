const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("GEMINI_API_KEY is missing in .env");
        return;
    }

    try {
        // This is a bit tricky as listing models isn't directly in the GenAI class in some versions
        // but let's try a simple request to a likely endpoint or just check the key validity
        // Actually, the easiest way to check if the key is valid is to try a very simple model like 'gemini-1.5-flash'
        // which we already did.

        // Let's try to see if we can get the model info
        const genAI = new GoogleGenerativeAI(key);
        // There isn't a direct listModels in the main export of @google/generative-ai easily.
        // It's usually part of the admin/management API which requires different auth.

        console.log("Attempting to connect with key...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (error) {
        console.error("Error type:", error.constructor.name);
        console.error("Error status:", error.status);
        console.error("Error message:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

listModels();
