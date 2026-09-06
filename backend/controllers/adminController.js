const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Block/Unblock user (assuming a 'isBlocked' field or handling via role/status)
//          For now, let's assume we toggle a specific field or just use this for updates.
//          The prompt asked for PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Toggle blocked status if it exists, or maybe we add it to the schema?
            // User schema didn't have isBlocked, let's verify if we need to add it.
            // For now, let's just assume we might want to change role or add a new field.
            // Let's add isBlocked to User schema in a separate step if needed.
            // Or we can just use this to basic update.
            // The prompt "PUT /api/admin/users/:id/status -> block/unblock user" implies we need a status or isBlocked field.
            // I'll add 'isBlocked' to user schema update as next step.
            user.isBlocked = !user.isBlocked;
            await user.save();
            res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, isBlocked: user.isBlocked });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all recipes
// @route   GET /api/admin/recipes
// @access  Private/Admin
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({}).populate('user', 'username email').sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete recipe
// @route   DELETE /api/admin/recipes/:id
// @access  Private/Admin
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            await recipe.deleteOne();
            res.json({ message: 'Recipe removed' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all comments
// @route   GET /api/admin/comments
// @access  Private/Admin
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('user', 'username').populate('recipe', 'title').sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment) {
            await comment.deleteOne();
            res.json({ message: 'Comment removed' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const recipeCount = await Recipe.countDocuments();
        const commentCount = await Comment.countDocuments();

        // Get recent items
        const recentUsers = await User.find({}).select('username email createdAt').sort({ createdAt: -1 }).limit(5);
        const recentRecipes = await Recipe.find({}).populate('user', 'username').select('title createdAt').sort({ createdAt: -1 }).limit(5);
        const recentComments = await Comment.find({}).populate('user', 'username').populate('recipe', 'title').sort({ createdAt: -1 }).limit(5);

        // Category distribution
        const categoryDistribution = await Recipe.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Sum of all likes across all recipes
        const likesResult = await Recipe.aggregate([
            {
                $project: {
                    numberOfLikes: {
                        $cond: {
                            if: { $isArray: "$likes" },
                            then: { $size: "$likes" },
                            else: { $ifNull: ["$likes", 0] }
                        }
                    }
                }
            },
            { $group: { _id: null, totalLikes: { $sum: "$numberOfLikes" } } }
        ]);
        const totalLikes = likesResult.length > 0 ? likesResult[0].totalLikes : 0;

        res.json({
            users: userCount,
            recipes: recipeCount,
            comments: commentCount,
            likes: totalLikes,
            recentUsers,
            recentRecipes,
            recentComments,
            categoryDistribution
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    updateUserStatus,
    getRecipes,
    deleteRecipe,
    getComments,
    deleteComment,
    getStats
};
