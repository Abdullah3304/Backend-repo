// server.js - Complete Backend

// ------------------------
// 1. Imports & Setup
// ------------------------
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { getBotResponse } = require("./Chatbot/chatbot");

// Routes
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const threadRoutes = require('./routes/threadRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const fitnessProductRoutes = require('./routes/fitnessProductRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

// ------------------------
// 2. Middleware
// ------------------------
dotenv.config(); // Load environment variables

const app = express(); // Initialize Express App

// CORS configuration - Allow frontend access
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL // Add your frontend Vercel URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// 3. Routes
// ------------------------

// Chatbot Route
app.post("/api/chatbot", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

  const reply = getBotResponse(message);
  res.json({ reply });
});

// Email Route (Checkout Receipt)
app.use('/api', emailRoutes); // POST /api/send-receipt

// Orders
app.use('/api/orders', orderRoutes);

// Auth & Users
app.use('/api/auth', authRoutes);
app.use('/api', cartRoutes);
app.use('/api', userRoutes);

// Admin
app.use('/api/admin', adminRoutes);

// Workouts & Community
app.use('/api/workouts', workoutRoutes);
app.use('/api/threads', threadRoutes);

// Trainers (Protected)
app.use('/api/trainers', authenticateToken, trainerRoutes);

// Fitness Products
app.use('/api/fitness-products', fitnessProductRoutes);

// Protected Test Route
app.use('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// ------------------------
// 4. File Upload Setup
// ------------------------
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save to uploads folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  console.log(req.body);
  console.log(req.file);
  mongoose.set('debug', true); // optional debug
  res.status(200).send('File uploaded successfully');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route (for Insomnia or Postman)
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working fine ✅'
  });
});

// ------------------------
// 5. Connect Database & Start Server
// ------------------------
// Connect to database (cached for serverless)
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
