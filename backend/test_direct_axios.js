const axios = require('axios');
require('dotenv').config();

async function testDirect() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

    try {
        console.log("Testing direct API call to:", url.split('key=')[0] + "key=HIDDEN");
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Explain quantum physics in one sentence." }] }]
        });
        console.log("Success!");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Direct API Error:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testDirect();
