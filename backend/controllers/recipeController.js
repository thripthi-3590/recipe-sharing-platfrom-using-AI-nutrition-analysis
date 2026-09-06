const Recipe = require('../models/Recipe');
const { analyzeRecipe } = require('./aiController');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
    try {
        const { q, category } = req.query;
        let query = {};

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { ingredients: { $regex: q, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const recipes = await Recipe.find(query).populate('user', 'username').sort({ createdAt: -1 });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
const rateRecipe = async (req, res) => {
    try {
        const { rating } = req.body;
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const userRating = recipe.ratings.find(r => r.user.toString() === req.user.id);

        if (userRating) {
            userRating.rating = rating;
        } else {
            recipe.ratings.push({ user: req.user.id, rating });
        }

        // Calculate average rating
        const totalRating = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
        recipe.averageRating = (totalRating / recipe.ratings.length).toFixed(1);

        await recipe.save();
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('user', 'username');
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
    if (!req.body.title || !req.body.ingredients) {
        res.status(400).json({ message: 'Please add title and ingredients' });
        return;
    }

    // Optional: Trigger AI analysis here automatically
    // const aiAnalysis = await analyzeRecipeAI(req.body.title, req.body.ingredients);

    try {
        const recipe = await Recipe.create({
            user: req.user.id,
            title: req.body.title,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            imageUrl: req.body.imageUrl,
            category: req.body.category,
            difficulty: req.body.difficulty,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            nutrition: req.body.nutrition || {},
            aiSuggestions: req.body.aiSuggestions || [],
        });

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update recipe (including AI analysis results)
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(400).json({ message: 'Recipe not found' });
        return;
    }

    // Check user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the recipe user
    if (recipe.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedRecipe);
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(400).json({ message: 'Recipe not found' });
        return;
    }

    if (recipe.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await recipe.remove();

    res.status(200).json({ id: req.params.id });
};

// @desc    Save a recipe variation
// @route   POST /api/recipes/:id/variations
// @access  Private
const saveVariation = async (req, res) => {
    try {
        const parentId = req.params.id;
        const { title, ingredients, instructions, servings, variationName } = req.body;

        const parentRecipe = await Recipe.findById(parentId);
        if (!parentRecipe) {
            res.status(404);
            throw new Error('Original recipe not found');
        }

        const variation = new Recipe({
            user: req.user._id,
            title: title || `${parentRecipe.title} (Variation)`,
            ingredients,
            instructions,
            imageUrl: parentRecipe.imageUrl, // Inherit image by default
            category: parentRecipe.category,
            difficulty: parentRecipe.difficulty,
            prepTime: parentRecipe.prepTime,
            cookTime: parentRecipe.cookTime,
            nutrition: parentRecipe.nutrition, // Should ideally recalculate, but inheriting for now
            servings: servings || parentRecipe.servings,
            parentRecipe: parentId,
            isVariation: true,
            variationName: variationName || 'My Twist'
        });

        const createdVariation = await variation.save();
        res.status(201).json(createdVariation);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get variations for a recipe
// @route   GET /api/recipes/:id/variations
// @access  Private
const getVariations = async (req, res) => {
    try {
        // Find variations where parentRecipe is the ID, AND user is the current user (private variations)
        // Or if we want public variations, we could remove the user check. For now, strictly personal variations.
        const variations = await Recipe.find({
            parentRecipe: req.params.id,
            user: req.user._id
        });
        res.json(variations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Scale a recipe
// @route   POST /api/recipes/:id/scale
// @access  Private
const scaleRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { newServings } = req.body;

        if (!newServings || newServings <= 0) {
            return res.status(400).json({ message: 'Please provide a valid number of new servings.' });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        if (!recipe.servings || recipe.servings <= 0) {
            return res.status(400).json({ message: 'Original recipe servings not defined or invalid, cannot scale.' });
        }

        const scaleFactor = newServings / recipe.servings;

        // Simple scaling for ingredients (assuming ingredients are strings with quantities)
        const scaledIngredients = recipe.ingredients.map(ingredient => {
            // This is a very basic example. A real-world scenario would need more robust parsing.
            // For example, "2 cups flour" -> "4 cups flour"
            // This example just appends the scale factor for demonstration.
            return `${ingredient} (scaled x${scaleFactor.toFixed(2)})`;
        });

        // Create a new recipe entry for the scaled version, or return scaled data
        // For now, let's just return the scaled data without saving a new recipe.
        // If we wanted to save it as a variation, we'd use the saveVariation logic.
        const scaledRecipeData = {
            ...recipe.toObject(), // Convert Mongoose document to plain object
            servings: newServings,
            ingredients: scaledIngredients,
            title: `${recipe.title} (Scaled to ${newServings} servings)`,
            // Clear _id and other Mongoose specific fields if creating a new document
            _id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            __v: undefined,
            isVariation: true, // Mark as a variation if it's a new derived recipe
            parentRecipe: recipe._id, // Link to the original recipe
            variationName: `Scaled to ${newServings} servings`
        };

        res.status(200).json(scaledRecipeData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    rateRecipe,
    saveVariation,
    getVariations,
    scaleRecipe,
};
