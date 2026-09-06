const express = require('express');
const router = express.Router();
const {
    setNutritionGoals,
    getNutritionGoals,
    getDailyProgress,
    getWeeklyHistory
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/goals').post(protect, setNutritionGoals).get(protect, getNutritionGoals);
router.route('/progress').get(protect, getDailyProgress);
router.route('/history').get(protect, getWeeklyHistory);

module.exports = router;
