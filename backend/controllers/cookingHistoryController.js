const CookingHistory = require('../models/CookingHistory');
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// @desc    Mark a recipe as cooked
// @route   POST /api/cooking-history
// @access  Private
const markAsCooked = async (req, res) => {
    try {
        const { recipeId, notes, rating } = req.body;

        const history = await CookingHistory.create({
            user: req.user._id,
            recipe: recipeId,
            notes,
            rating,
            cookedAt: Date.now()
        });

        // If rating provided, update recipe rating
        if (rating) {
            const recipe = await Recipe.findById(recipeId);
            if (recipe) {
                const existingRatingIndex = recipe.ratings.findIndex(
                    r => r.user.toString() === req.user._id.toString()
                );

                if (existingRatingIndex > -1) {
                    recipe.ratings[existingRatingIndex].rating = Number(rating);
                } else {
                    recipe.ratings.push({
                        user: req.user._id,
                        rating: Number(rating)
                    });
                }

                // Recalculate average
                recipe.averageRating = recipe.ratings.reduce((acc, item) => item.rating + acc, 0) / recipe.ratings.length;
                await recipe.save();
            }
        }

        res.status(201).json(history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user cooking history
// @route   GET /api/cooking-history
// @access  Private
const getCookingHistory = async (req, res) => {
    try {
        const history = await CookingHistory.find({ user: req.user._id })
            .sort({ cookedAt: -1 })
            .populate('recipe', 'title imageUrl category difficulty cookTime');

        res.json(history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get cooking statistics
// @route   GET /api/cooking-history/stats
// @access  Private
const getCookingStats = async (req, res) => {
    try {
        const history = await CookingHistory.find({ user: req.user._id }).sort({ cookedAt: -1 });

        // Calculate total cooked
        const totalCooked = history.length;

        // Calculate streak
        let currentStreak = 0;
        if (history.length > 0) {
            // Sort dates unique days
            const uniqueDays = [...new Set(history.map(h => new Date(h.cookedAt).setHours(0, 0, 0, 0)))].sort((a, b) => b - a);

            // Check if cooked today or yesterday to start streak
            const today = new Date().setHours(0, 0, 0, 0);
            const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

            if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
                currentStreak = 1;
                // Look backwards
                let lastDate = uniqueDays[0];
                for (let i = 1; i < uniqueDays.length; i++) {
                    // Difference in days
                    const diff = (lastDate - uniqueDays[i]) / (1000 * 60 * 60 * 24);
                    if (diff === 1) {
                        currentStreak++;
                        lastDate = uniqueDays[i];
                    } else {
                        break;
                    }
                }
            }
        }

        // Calculate most active category (simple aggregation)
        // Need to populate recipes for this, or do an aggregation query. Aggregation is better.
        const categoryStats = await CookingHistory.aggregate([
            { $match: { user: req.user._id } },
            { $lookup: { from: 'recipes', localField: 'recipe', foreignField: '_id', as: 'recipeData' } },
            { $unwind: '$recipeData' },
            { $group: { _id: '$recipeData.category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const favoriteCategory = categoryStats.length > 0 ? categoryStats[0]._id : 'None';

        res.json({
            totalCooked,
            currentStreak,
            favoriteCategory
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get most cooked recipes
// @route   GET /api/cooking-history/top-recipes
// @access  Private
const getMostCookedRecipes = async (req, res) => {
    try {
        const topRecipes = await CookingHistory.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$recipe', count: { $sum: 1 }, lastCooked: { $max: '$cookedAt' } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'recipes', localField: '_id', foreignField: '_id', as: 'recipeDetails' } },
            { $unwind: '$recipeDetails' }
        ]);

        res.json(topRecipes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    markAsCooked,
    getCookingHistory,
    getCookingStats,
    getMostCookedRecipes
};
