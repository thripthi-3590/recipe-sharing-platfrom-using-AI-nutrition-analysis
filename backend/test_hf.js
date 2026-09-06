const axios = require('axios');

async function testHuggingFace() {
    console.log("Testing Hugging Face AI for recipe generation...\n");

    const ingredients = "chicken curry";
    const prompt = `Create a recipe for: ${ingredients}. Include title, ingredients list, and cooking instructions.`;

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
            { inputs: prompt, parameters: { max_new_tokens: 500, temperature: 0.7 } },
            { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
        );

        console.log("✅ SUCCESS! AI Response:");
        console.log(response.data[0]?.generated_text || response.data);
        console.log("\n🎉 Alternative AI is working!");

    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.response) {
            console.log("Response data:", error.response.data);
        }
    }
}

testHuggingFace();
