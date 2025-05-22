// Import required modules
const orderRoutes = require('./routes/orderRoutes');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const trainerRoutes = require('./routes/trainerRoutes');  // Import trainer routes
const { authenticateToken } = require('./Middleware/authMiddleware'); 
const threadRoutes = require('./routes/threadRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const app = express();
require('dotenv').config();

dotenv.config();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle CORS preflight requests
app.options('*', cors(corsOptions));

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.name === 'CORSError') {
    return res.status(403).json({
      error: 'CORS error',
      message: 'Not allowed by CORS'
    });
  }
  next(err);
});

app.use('/api/orders', orderRoutes);
app.use(cors({
  origin: 'http://localhost:3000', // your frontend origin
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  
    },
  }),
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);  
app.use('/api', cartRoutes);       
app.use('/api', productRoutes);    
app.use('/api', userRoutes);       
app.use('/api/admin', adminRoutes);

app.use('/api/workouts', workoutRoutes);

app.use('/api/threads', threadRoutes);

// New Trainer Routes
app.use('/api/trainers', trainerRoutes);  // Mount the trainer routes here

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  console.log(req.body);  
  console.log(req.file);  
  mongoose.set('debug', true);

  res.status(200).send('File uploaded successfully');
});

app.use('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/orders', (req, res) => {
  console.log('POST /api/orders hit');
  res.json({ message: 'Order route works!' });
});
