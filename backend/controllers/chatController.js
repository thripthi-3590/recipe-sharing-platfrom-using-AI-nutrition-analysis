const User = require('../models/User');

// @desc    Handle chat messages
// @route   POST /api/chat
// @access  Private
exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Simple response logic - in a real app, you might integrate with an AI service here
    const responses = {
      'hello': 'Hello! How can I help you with recipes today?',
      'hi': 'Hi there! What kind of recipe are you looking for?',
      'sweet': 'Here are some sweet recipes you might like: Chocolate Cake, Apple Pie, or Tiramisu.',
      'spicy': 'Try these spicy recipes: Spicy Chicken Curry, Kimchi Fried Rice, or Vindaloo.',
      'quick': 'Quick meal ideas: Pasta Aglio e Olio, Avocado Toast, or a simple Stir Fry.',
      'vegan': 'Variances of vegan recipes: Chickpea Curry, Buddha Bowl, or Lentil Soup.',
      'italian': 'Italian favorites: Spaghetti Carbonara, Margherita Pizza, or Risotto.',
      'breakfast': 'Breakfast ideas: Avocado Toast, Smoothie Bowl, or Pancakes.',
      'lunch': 'Lunch suggestions: Quinoa Salad, Chicken Wrap, or Sushi Bowl.',
      'dinner': 'Dinner options: Grilled Salmon, Stuffed Peppers, or Pasta Primavera.'
    };

    // Default response if no specific keyword is matched
    let reply = 'I can help you find recipes! Try asking for sweet, spicy, quick, vegan, Italian, breakfast, lunch, or dinner recipes.';
    
    // Check if the message contains any of our keywords
    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        reply = value;
        break;
      }
    }

    // In a real app, you might want to save the chat history
    // await Chat.create({
    //   user: req.user.id,
    //   message,
    //   reply,
    // });

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
};
