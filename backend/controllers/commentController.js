const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// @desc    Get comments for a recipe
// @route   GET /api/recipes/:id/comments
// @access  Public
const getCommentsByRecipe = async (req, res) => {
    try {
        const comments = await Comment.find({ recipe: req.params.id })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a comment
// @route   POST /api/recipes/:id/comments
// @access  Private
const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const recipeId = req.params.id;

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const comment = await Comment.create({
            text,
            recipe: recipeId,
            user: req.user.id
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username profilePicture');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCommentsByRecipe,
    createComment
};
