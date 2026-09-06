const express = require('express');
const router = express.Router();
const { analyzeRecipe, generateRecipe, getSubstitutions } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeRecipe);
router.post('/generate', protect, generateRecipe);
router.post('/substitutions', protect, getSubstitutions);

module.exports = router;
