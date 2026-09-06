const express = require('express');
const router = express.Router();
const { getMealPlans, addMealPlan, deleteMealPlan } = require('../controllers/mealPlanController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMealPlans)
    .post(protect, addMealPlan);

router.route('/:id').delete(protect, deleteMealPlan);

module.exports = router;
