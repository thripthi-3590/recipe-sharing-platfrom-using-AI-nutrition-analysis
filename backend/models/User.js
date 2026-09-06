const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'chef'],
        default: 'user',
    },
    profilePicture: {
        type: String,
        default: '',
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
    }],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    shoppingList: {
        type: [{
            item: { type: String, required: true },
            amount: { type: String, default: '' },
            unit: { type: String, default: '' },
            checked: { type: Boolean, default: false }
        }],
        default: []
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    nutritionGoals: {
        dailyCalories: { type: Number, default: 2000 },
        dailyProtein: { type: Number, default: 50 },
        dailyCarbs: { type: Number, default: 250 },
        dailyFats: { type: Number, default: 70 },
        dailyFiber: { type: Number, default: 25 },
    },
    themePreference: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'light',
    },
}, {
    timestamps: true,
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
