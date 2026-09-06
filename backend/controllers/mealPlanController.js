const MealPlan = require('../models/MealPlan');

// @desc    Get user meal plans
// @route   GET /api/meal-plans
// @access  Private
const getMealPlans = async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({ user: req.user.id })
            .populate('recipe')
            .sort({ date: 1 });
        res.status(200).json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add recipe to meal plan
// @route   POST /api/meal-plans
// @access  Private
const addMealPlan = async (req, res) => {
    try {
        const { recipeId, date, mealType } = req.body;
        let mealPlan = await MealPlan.create({
            user: req.user.id,
            recipe: recipeId,
            date,
            mealType
        });
        mealPlan = await mealPlan.populate('recipe');
        res.status(200).json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete meal plan entry
// @route   DELETE /api/meal-plans/:id
// @access  Private
const deleteMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan entry not found' });
        }
        if (mealPlan.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await mealPlan.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMealPlans, addMealPlan, deleteMealPlan };
