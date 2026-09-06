const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Require routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const chatRoutes = require('./routes/chatRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const cookingHistoryRoutes = require('./routes/cookingHistoryRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/generate-recipe', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/cooking-history', cookingHistoryRoutes);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
