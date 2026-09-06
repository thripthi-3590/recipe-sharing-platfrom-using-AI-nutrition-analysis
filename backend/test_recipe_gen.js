const axios = require('axios');

// Test the /api/ai/generate endpoint with "veg biriyani"
async function testRecipeGeneration() {
    try {
        console.log("Testing recipe generation with 'veg biriyani'...\n");

        // Note: This will fail without auth token, but we can test the fallback by directly calling the controller
        const { generateRecipe } = require('./controllers/aiController');

        const mockReq = {
            body: { ingredients: 'veg biriyani' }
        };

        const mockRes = {
            status: function (code) {
                console.log(`Response status: ${code}`);
                return this;
            },
            json: function (data) {
                console.log("\n✅ SUCCESS! Recipe generated:");
                console.log("=".repeat(50));
                console.log(`Title: ${data.title}`);
                console.log(`Category: ${data.category}`);
                console.log(`Difficulty: ${data.difficulty}`);
                console.log(`Prep Time: ${data.prepTime} minutes`);
                console.log(`Cook Time: ${data.cookTime} minutes`);
                console.log(`\nIngredients:\n${data.ingredients}`);
                console.log(`\nInstructions:\n${data.instructions}`);
                if (data.nutrition) {
                    console.log(`\nNutrition: ${JSON.stringify(data.nutrition)}`);
                }
                if (data.aiSuggestions) {
                    console.log(`\nAI Suggestions: ${JSON.stringify(data.aiSuggestions)}`);
                }
                console.log("=".repeat(50));
                return this;
            }
        };

        await generateRecipe(mockReq, mockRes);

    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testRecipeGeneration();
