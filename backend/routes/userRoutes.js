const express = require('express');
const router = express.Router();
const {
    toggleFavorite,
    getFavorites,
    getUserProfile,
    updateShoppingList,
    getShoppingList,
    toggleFollow,
    getActivityFeed,
    getTopChefs,
    createCollection,
    getCollections,
    getCollectionById,
    addRecipeToCollection
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/favorites/:id', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.get('/profile/:id', getUserProfile);
router.route('/shopping-list')
    .get(protect, getShoppingList)
    .put(protect, updateShoppingList);
router.put('/follow/:id', protect, toggleFollow);
router.get('/feed', protect, getActivityFeed);
router.post('/collections', protect, createCollection);
router.get('/collections', protect, getCollections);
router.get('/collections/:id', protect, getCollectionById);
router.post('/collections/add', protect, addRecipeToCollection);
router.get('/top-chefs', getTopChefs);

module.exports = router;
