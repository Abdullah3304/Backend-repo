require('dotenv').config();  

const mongoose = require('mongoose');

// Cache the database connection for serverless
let cachedDb = null;

const connectDB = async () => {
  // If already connected, reuse the connection
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    cachedDb = db;
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process in serverless - just throw the error
    throw error;
  }
};

module.exports = connectDB;
