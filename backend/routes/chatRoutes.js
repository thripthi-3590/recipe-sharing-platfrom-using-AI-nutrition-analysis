const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { handleChatMessage } = require('../controllers/chatController');

// Apply protect middleware to ensure only authenticated users can access these routes
router.post('/', protect, handleChatMessage);

module.exports = router;
