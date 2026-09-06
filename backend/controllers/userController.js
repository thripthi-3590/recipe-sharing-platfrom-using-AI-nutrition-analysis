const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Collection = require('../models/Collection');

// @desc    Toggle favorite recipe
// @route   PUT /api/users/favorites/:id
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user._id;
        const recipeId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID format' });
        }

        // First, check if the recipe is already favorited to determine the action
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favorites.some(fav => fav && fav.toString() === recipeId);

        // Use atomic operator for the update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            isFavorite
                ? { $pull: { favorites: recipeId } }
                : { $addToSet: { favorites: recipeId } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Could not update user favorites' });
        }

        const favorites = updatedUser.favorites ? updatedUser.favorites.filter(f => f).map(f => f.toString()) : [];

        res.status(200).json({
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            favorites
        });
    } catch (error) {
        console.error("Critical ToggleFavorite Error:", error);
        res.status(500).json({
            message: 'Internal Server Error during favorite toggle',
            details: error.message
        });
    }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile and recipes
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const recipes = await Recipe.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ user, recipes });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update shopping list
// @route   PUT /api/users/shopping-list
// @access  Private
const updateShoppingList = async (req, res) => {
    console.log('Updating shopping list with:', { body: req.body, user: req.user });
    
    try {
        const { items, action } = req.body;
        
        if (!req.user || !req.user._id) {
            console.error('No user in request');
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Find user and explicitly select the shoppingList field
        const user = await User.findById(req.user._id).select('shoppingList');
        
        if (!user) {
            console.error('User not found with ID:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize shoppingList if it doesn't exist
        if (!user.shoppingList) {
            user.shoppingList = [];
        } else if (!Array.isArray(user.shoppingList)) {
            console.warn('shoppingList is not an array, resetting to empty array');
            user.shoppingList = [];
        }

        console.log('Current shopping list before update:', user.shoppingList);

        try {
            if (action === 'add') {
                if (Array.isArray(items)) {
                    items.forEach(itemInput => {
                        const itemName = typeof itemInput === 'string' ? itemInput : itemInput.item;
                        if (itemName) {
                            const exists = user.shoppingList.some(
                                i => i && i.item && i.item.toLowerCase() === itemName.toLowerCase()
                            );
                            if (!exists) {
                                user.shoppingList.push({
                                    item: itemName,
                                    checked: false
                                });
                                console.log('Added item:', itemName);
                            }
                        }
                    });
                }
            } else if (action === 'remove' && Array.isArray(items)) {
                const itemNamesToRemove = items.map(i => 
                    typeof i === 'string' ? i.toLowerCase() : (i?.item || '').toLowerCase()
                ).filter(Boolean);
                
                user.shoppingList = user.shoppingList.filter(
                    i => i && i.item && !itemNamesToRemove.includes(i.item.toLowerCase())
                );
                console.log('Removed items. New list length:', user.shoppingList.length);
            } else if (action === 'toggle' && Array.isArray(items) && items.length > 0) {
                const itemName = typeof items[0] === 'string' ? items[0] : (items[0]?.item || '');
                if (itemName) {
                    const item = user.shoppingList.find(
                        i => i && i.item && i.item.toLowerCase() === itemName.toLowerCase()
                    );
                    if (item) {
                        item.checked = !item.checked;
                        console.log('Toggled item:', itemName, 'to', item.checked);
                    }
                }
            } else if (action === 'clearChecked') {
                user.shoppingList = user.shoppingList.filter(i => !i.checked);
                console.log('Cleared checked items. New list length:', user.shoppingList.length);
            }

            // Ensure we're only saving the shoppingList field
            const result = await User.findByIdAndUpdate(
                user._id,
                { shoppingList: user.shoppingList },
                { new: true, select: 'shoppingList' }
            );
            
            console.log('Update result:', result);
            res.status(200).json(result.shoppingList || []);
            
        } catch (updateError) {
            console.error('Error during shopping list update operation:', updateError);
            throw updateError; // This will be caught by the outer catch
        }
        
    } catch (error) {
        console.error('Error in updateShoppingList:', {
            error: error.message,
            stack: error.stack,
            ...(error.response?.data && { responseData: error.response.data })
        });
        res.status(500).json({ 
            message: 'Server error', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
};

// @desc    Get shopping list
// @route   GET /api/users/shopping-list
// @access  Private
const getShoppingList = async (req, res) => {
    console.log('Getting shopping list for user:', req.user?._id);
    
    try {
        if (!req.user || !req.user._id) {
            console.error('No user in request');
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Get fresh data from the database
        const user = await User.findById(req.user._id).select('shoppingList');
        
        if (!user) {
            console.error('User not found with ID:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure we always return an array
        const shoppingList = Array.isArray(user.shoppingList) ? user.shoppingList : [];
        
        console.log('Retrieved shopping list:', shoppingList);
        res.status(200).json(shoppingList);
        
    } catch (error) {
        console.error('Error in getShoppingList:', {
            error: error.message,
            stack: error.stack,
            userId: req.user?._id
        });
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// @desc    Follow/Unfollow user
// @route   PUT /api/users/follow/:id
// @access  Private
const toggleFollow = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const me = req.user;

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (me.id === userToFollow.id) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const isFollowing = me.following.includes(userToFollow.id);

        if (isFollowing) {
            // Unfollow
            me.following = me.following.filter(id => id.toString() !== userToFollow.id);
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== me.id);
        } else {
            // Follow
            me.following.push(userToFollow.id);
            userToFollow.followers.push(me.id);
        }

        await me.save();
        await userToFollow.save();

        res.status(200).json({ isFollowing: !isFollowing });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get social activity feed
// @route   GET /api/users/feed
// @access  Private
const getActivityFeed = async (req, res) => {
    try {
        const user = req.user;
        const recipes = await Recipe.find({ user: { $in: user.following } })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new recipe collection
// @route   POST /api/users/collections
// @access  Private
const createCollection = async (req, res) => {
    try {
        const { name } = req.body;
        const collection = await Collection.create({
            user: req.user._id,
            name,
        });
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's recipe collections
// @route   GET /api/users/collections
// @access  Private
const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ user: req.user._id }).populate('recipes');
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single collection by ID
// @route   GET /api/users/collections/:id
// @access  Private
const getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findOne({ _id: req.params.id, user: req.user._id }).populate('recipes');
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a recipe to a collection
// @route   POST /api/users/collections/add
// @access  Private
const addRecipeToCollection = async (req, res) => {
    try {
        const { collectionId, recipeId } = req.body;
        const collection = await Collection.findOne({ _id: collectionId, user: req.user._id });
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        if (!collection.recipes.includes(recipeId)) {
            collection.recipes.push(recipeId);
            await collection.save();
        }
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get top performing chefs
// @route   GET /api/users/top-chefs
// @access  Public
const getTopChefs = async (req, res) => {
    try {
        // Find users and their recipe counts
        // For now, simpler implementation: get users with most followers or recipes
        // Let's get users and count their recipes
        const chefs = await User.find({}).select('username profilePicture followers following').limit(10);

        const chefsWithStats = await Promise.all(chefs.map(async (chef) => {
            const recipeCount = await Recipe.countDocuments({ user: chef._id });
            return {
                ...chef._doc,
                recipeCount
            };
        }));

        // Sort by recipe count descending
        chefsWithStats.sort((a, b) => b.recipeCount - a.recipeCount);

        res.status(200).json(chefsWithStats.slice(0, 5));
    } catch (error) {
        console.error("Error in getTopChefs:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    toggleFavorite,
    getFavorites,
    getUserProfile,
    updateShoppingList,
    getShoppingList,
    toggleFollow,
    getActivityFeed,
    createCollection,
    getCollections,
    getCollectionById,
    addRecipeToCollection,
    getTopChefs
};
