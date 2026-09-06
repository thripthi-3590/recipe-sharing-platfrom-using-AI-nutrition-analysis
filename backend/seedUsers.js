const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-app';

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin@1234',
    role: 'admin',
    profilePicture: 'https://i.pravatar.cc/150?img=1'
  },
  {
    username: 'chef',
    email: 'chef@example.com',
    password: 'Chef@1234',
    role: 'chef',
    profilePicture: 'https://i.pravatar.cc/150?img=3'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'User@1234',
    role: 'user',
    profilePicture: 'https://i.pravatar.cc/150?img=5'
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing users (optional, be careful in production)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        const newUser = new User({
          username: user.username,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          profilePicture: user.profilePicture
        });

        return newUser.save();
      })
    );

    console.log('Successfully created users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
