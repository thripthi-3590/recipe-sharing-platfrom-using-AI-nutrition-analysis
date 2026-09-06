const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String, // Storing as a big multiline string for simplicity in prompt engineering
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Baking', 'Smoothie', 'Appetizer'],
        default: 'Dinner',
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy',
    },
    prepTime: {
        type: Number,
        default: 0,
    },
    cookTime: {
        type: Number,
        default: 0,
    },
    nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
        fiber: Number,
    },
    aiSuggestions: [String],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    servings: {
        type: Number,
        default: 4,
    },
    parentRecipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        default: null,
    },
    isVariation: {
        type: Boolean,
        default: false,
    },
    variationName: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
