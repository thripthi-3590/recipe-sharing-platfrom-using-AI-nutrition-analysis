const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        console.log("Listing models...");
        const response = await axios.get(url);
        console.log("Found models:");
        response.data.models.forEach(m => console.log(m.name));
    } catch (error) {
        console.error("List Models Error:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

listModels();
