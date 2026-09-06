const express = require('express');
const router = express.Router();
const {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    rateRecipe,
    saveVariation,
    getVariations,
    scaleRecipe
} = require('../controllers/recipeController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getCommentsByRecipe,
    createComment
} = require('../controllers/commentController');

router.route('/').get(getRecipes).post(protect, createRecipe);

router.route('/:id').get(getRecipeById).put(protect, updateRecipe).delete(protect, deleteRecipe);
router.route('/:id/rate').post(protect, rateRecipe);
router.route('/:id/variations').post(protect, saveVariation).get(protect, getVariations);
router.route('/:id/scale').post(protect, scaleRecipe);

// Nested comment routes
router.route('/:id/comments').get(getCommentsByRecipe).post(protect, createComment);

module.exports = router;
