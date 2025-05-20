const mongoose = require('mongoose');
const User = require('./models/User');  // Ensure the path is correct
const testPassword =require ('./testhashing')

mongoose.connect('mongodb://localhost:27017/sample_mflix', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

const email = 'abdullah@gmail.com'; // Ensure this matches the email stored in the DB

// Test fetching a user by email
User.findOne({ email })
  .then((user) => {
    console.log('User found:', user);  // Should log user data if found
    if (!user) {
      console.log('User not found');
    }
  })
  .catch((err) => {
    console.log('Error fetching user:', err);
  });
User.find()  // Fetch all users
  .then((users) => {
    console.log('All users in DB:', users);  // Log all users to check the database content
  })
  .catch((err) => {
    console.log('Error fetching all users:', err);
  });

  