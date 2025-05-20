// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  recoveryEmail: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
