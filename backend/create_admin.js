const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        const email = 'admin@example.com';
        const password = 'adminpassword';
        const username = 'AdminUser';

        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            user.password = password; // Reset password to known one
            await user.save();
            console.log('Existing user updated to admin.');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        } else {
            user = await User.create({
                username,
                email,
                password,
                role: 'admin'
            });
            console.log('Admin user created.');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
