const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-app';

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s for local dev
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    
    console.log('Current users in database:');
    users.forEach(user => {
      console.log('-------------------');
      console.log(`ID: ${user._id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Created At: ${user.createdAt}`);
    });

    // Check if we can find our test users
    console.log('\nChecking for test users:');
    const testEmails = ['admin@example.com', 'chef@example.com', 'user@example.com'];
    
    for (const email of testEmails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ Found user: ${email} (${user.role})`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers();
