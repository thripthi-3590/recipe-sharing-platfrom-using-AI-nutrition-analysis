/**
 * Handles AI analysis of recipes.
 * Uses Google Generative AI (Gemini) with comprehensive fallback database.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// API will be initialized per-request to handle API key issues gracefully

// @desc    Analyze recipe nutrition and suggestions
// @route   POST /api/ai/analyze
// @access  Private (or Public)
const analyzeRecipe = async (req, res) => {
    const { title, ingredients } = req.body;

    if (!title || !ingredients) {
        return res.status(400).json({ message: 'Title and ingredients required' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            As a nutritionist, analyze this recipe: "${title}" with ingredients: "${ingredients}".
            Provide realistic nutritional information and 3-4 culinary suggestions for improvement.
            
            Return the response strictly as a JSON object with the following structure:
            {
                "nutrition": {
                    "calories": (number),
                    "protein": (number in grams),
                    "carbs": (number in grams),
                    "fats": (number in grams),
                    "fiber": (number in grams)
                },
                "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
            }
            Do not include any markdown formatting like \`\`\`json or backticks. Just the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No valid JSON found in AI response");
        }
        const cleanedText = text.substring(firstBrace, lastBrace + 1);
        const analysis = JSON.parse(cleanedText);

        res.status(200).json(analysis);
    } catch (error) {
        console.error("AI Analyze Error (using fallback):", error.message);

        // Mock fallback
        const mockAnalysis = {
            nutrition: { calories: 450, protein: 20, carbs: 50, fats: 15, fiber: 5 },
            suggestions: [
                "Consider using whole grain alternatives for added fiber.",
                "Add more vegetables for extra nutrients.",
                "Reduce salt and use herbs for flavor."
            ]
        };

        res.status(200).json(mockAnalysis);
    }
};

// @desc    Generate recipe from ingredients
// @route   POST /api/ai/generate
// @access  Private (or Public)
const generateRecipe = async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients) {
        return res.status(400).json({ message: 'Keywords or ingredients required' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are a master chef. Create a detailed, high-quality recipe based on these ingredients/keywords: ${ingredients}.
            The recipe should be creative, delicious, and professional.
            
            Return the response strictly as a JSON object with the following structure:
            {
                "title": "A catchy and professional name for the dish",
                "ingredients": "A multi-line string of ingredients with measurements",
                "instructions": "Detailed, step-by-step cooking instructions, each on a new line. Do not include step numbers.",
                "category": "One of: Breakfast, Lunch, Dinner, Snack, Dessert",
                "difficulty": "One of: Easy, Medium, Hard",
                "prepTime": (integer in minutes),
                "cookTime": (integer in minutes)
            }
            Do not include any markdown formatting like \`\`\`json or backticks. Just the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No valid JSON found in AI response");
        }
        const cleanedText = text.substring(firstBrace, lastBrace + 1);
        const generated = JSON.parse(cleanedText);

        res.status(200).json(generated);
    } catch (error) {
        console.error("AI Generation Error (using comprehensive database):", error.message);

        // Use comprehensive recipe database (120+ recipes)
        const inputLower = ingredients.toLowerCase();
        const mainRecipes = require('../data/recipeDatabase');
        const extendedRecipes = require('../data/extendedRecipes');
        const globalRecipes = require('../data/globalRecipes');
        const mockRecipes = [...mainRecipes, ...extendedRecipes, ...globalRecipes];

        // Improved matching: check for exact phrase matches first
        let matchedRecipe = mockRecipes.find(r =>
            r.keywords.some(k => k.includes(' ') && inputLower.includes(k))
        );

        // If no phrase match, try individual keyword matching
        if (!matchedRecipe) {
            matchedRecipe = mockRecipes.find(r =>
                r.keywords.some(k => !k.includes(' ') && inputLower.includes(k))
            );
        }

        // Default fallback
        const defaultMock = {
            title: "Creamy Mushroom Risotto",
            ingredients: "1.5 cups Arborio rice\n4 cups vegetable broth\n1 cup mushrooms, sliced\n1/2 cup parmesan cheese\n2 tbsp butter\n1 onion, diced\n2 cloves garlic, minced\n1/2 cup white wine",
            instructions: "Sauté onions and garlic in butter until soft.\nAdd mushrooms and cook until browned.\nStir in rice and cook for 1 minute.\nPour in wine and stir until absorbed.\nGradually add broth, one ladle at a time, stirring constantly until rice is tender.\nStir in cheese and season with salt and pepper.",
            category: "Dinner",
            difficulty: "Medium",
            prepTime: 15,
            cookTime: 30,
            nutrition: { calories: 420, protein: 14, carbs: 58, fats: 16, fiber: 3 },
            aiSuggestions: ["Try adding truffle oil for an earthy flavor.", "Top with fresh parsley for color.", "Use brown rice for more fiber (adjust cooking time)."]
        };

        res.status(200).json(matchedRecipe ? matchedRecipe.data : defaultMock);
    }
};

const getSubstitutions = async (req, res) => {
    try {
        const { ingredient } = req.body;
        if (!ingredient) {
            return res.status(400).json({ message: 'Ingredient required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Suggest 3-5 substitutes for "${ingredient}" in cooking. Return as JSON array of strings.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const subs = JSON.parse(text);
        res.status(200).json({ substitutions: subs });
    } catch (error) {
        console.error("Substitution error:", error);
        res.status(200).json({ substitutions: ["No substitutions available"] });
    }
};

module.exports = {
    analyzeRecipe,
    generateRecipe,
    getSubstitutions
};
