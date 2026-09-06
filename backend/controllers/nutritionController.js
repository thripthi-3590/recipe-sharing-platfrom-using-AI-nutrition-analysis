const User = require('../models/User');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// @desc    Set or update nutrition goals
// @route   POST /api/nutrition/goals
// @access  Private
const setNutritionGoals = async (req, res) => {
    try {
        const { dailyCalories, dailyProtein, dailyCarbs, dailyFats, dailyFiber } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.nutritionGoals = {
                dailyCalories: dailyCalories || user.nutritionGoals.dailyCalories,
                dailyProtein: dailyProtein || user.nutritionGoals.dailyProtein,
                dailyCarbs: dailyCarbs || user.nutritionGoals.dailyCarbs,
                dailyFats: dailyFats || user.nutritionGoals.dailyFats,
                dailyFiber: dailyFiber || user.nutritionGoals.dailyFiber,
            };

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                nutritionGoals: updatedUser.nutritionGoals,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user nutrition goals
// @route   GET /api/nutrition/goals
// @access  Private
const getNutritionGoals = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('nutritionGoals');
        if (user) {
            res.json(user.nutritionGoals);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get daily nutrition progress based on meal plan
// @route   GET /api/nutrition/progress
// @access  Private
const getDailyProgress = async (req, res) => {
    try {
        const dateParam = req.query.date;
        const date = dateParam ? new Date(dateParam) : new Date();

        // Construct start and end of day
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const mealPlans = await MealPlan.find({
            user: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('recipe');

        // Aggregate nutrition
        let totalNutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0
        };

        mealPlans.forEach(plan => {
            if (plan.recipe && plan.recipe.nutrition) {
                totalNutrition.calories += plan.recipe.nutrition.calories || 0;
                totalNutrition.protein += plan.recipe.nutrition.protein || 0;
                totalNutrition.carbs += plan.recipe.nutrition.carbs || 0;
                totalNutrition.fats += plan.recipe.nutrition.fats || 0;
                totalNutrition.fiber += plan.recipe.nutrition.fiber || 0;
            }
        });

        // Get goals to compare
        const user = await User.findById(req.user._id).select('nutritionGoals');

        res.json({
            date: startOfDay,
            total: totalNutrition,
            goals: user.nutritionGoals,
            mealCount: mealPlans.length
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get weekly nutrition history
// @route   GET /api/nutrition/history
// @access  Private
const getWeeklyHistory = async (req, res) => {
    try {
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const startOfDay = new Date();
        startOfDay.setDate(startOfDay.getDate() - 6); // Last 7 days including today
        startOfDay.setHours(0, 0, 0, 0);

        const mealPlans = await MealPlan.find({
            user: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('recipe');

        // Initialize last 7 days with 0
        const historyMap = new Map();
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfDay);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('en-US', { weekday: 'short' });
            historyMap.set(dateStr, {
                date: dateStr,
                displayDate,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0
            });
        }

        mealPlans.forEach(plan => {
            const dateStr = plan.date.toISOString().split('T')[0];
            if (historyMap.has(dateStr)) {
                const dayData = historyMap.get(dateStr);
                if (plan.recipe && plan.recipe.nutrition) {
                    dayData.calories += plan.recipe.nutrition.calories || 0;
                    dayData.protein += plan.recipe.nutrition.protein || 0;
                    dayData.carbs += plan.recipe.nutrition.carbs || 0;
                    dayData.fats += plan.recipe.nutrition.fats || 0;
                }
            }
        });

        const history = Array.from(historyMap.values());
        res.json(history);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    setNutritionGoals,
    getNutritionGoals,
    getDailyProgress,
    getWeeklyHistory
};
