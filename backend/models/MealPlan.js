const mongoose = require('mongoose');

const mealPlanSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe',
    },
    date: {
        type: Date,
        required: true,
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true,
    }
}, {
    timestamps: true,
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;
