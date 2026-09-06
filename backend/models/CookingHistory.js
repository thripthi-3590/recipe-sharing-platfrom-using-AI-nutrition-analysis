const mongoose = require('mongoose');

const cookingHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe',
    },
    cookedAt: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
}, {
    timestamps: true,
});

// Index to speed up queries for user cooking history
cookingHistorySchema.index({ user: 1, cookedAt: -1 });

const CookingHistory = mongoose.model('CookingHistory', cookingHistorySchema);

module.exports = CookingHistory;
