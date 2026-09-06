const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');
const {
    getUsers,
    deleteUser,
    updateUserStatus,
    getRecipes,
    deleteRecipe,
    getComments,
    deleteComment,
    getStats
} = require('../controllers/adminController');

// All routes are protected and require admin privileges
router.use(protect);
router.use(verifyAdmin);

router.get('/stats', getStats);

router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .delete(deleteUser);

router.put('/users/:id/status', updateUserStatus);

router.route('/recipes')
    .get(getRecipes);

router.route('/recipes/:id')
    .delete(deleteRecipe);

router.route('/comments')
    .get(getComments);

router.route('/comments/:id')
    .delete(deleteComment);

module.exports = router;
