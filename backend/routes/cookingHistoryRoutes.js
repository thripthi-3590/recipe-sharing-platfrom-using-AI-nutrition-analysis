const express = require('express');
const router = express.Router();
const {
    markAsCooked,
    getCookingHistory,
    getCookingStats,
    getMostCookedRecipes
} = require('../controllers/cookingHistoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, markAsCooked).get(protect, getCookingHistory);
router.route('/stats').get(protect, getCookingStats);
router.route('/top-recipes').get(protect, getMostCookedRecipes);

module.exports = router;
