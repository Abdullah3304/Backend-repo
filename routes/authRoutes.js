const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/cart');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ✅ Forgot Password (Send Token)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 mins
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(
      user.recoveryEmail,  // Make sure recoveryEmail exists in schema
      'Reset Your Password',
      `Click here to reset your password: ${resetLink}\n\nThis link expires in 15 minutes.`
    );

    res.json({ message: 'Reset link sent to your recovery email' });
  } catch (error) {
    console.error('Forgot-password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Reset Password (Use Token)
router.post('/reset-password', async (req, res) => {
  const { newPassword, token } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    console.log("<<<<<<<<<<<<<", token)

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset-password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/register', async (req, res) => {
  const { email, password, role, recoveryEmail } = req.body;

  console.log("<<<<<register>>>>>>>>")

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }
  try {
  
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      recoveryEmail,
      password: hashedPassword,
      role: role || 'user'
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/clear-cart', async (req, res) => {
  const { userId } = req.body; 

  try {
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Clear the cart
    userCart.items = [];
    userCart.totalPrice = 0;
    await userCart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }

  try {
    const user = await User.findOne({ email });

    // If no user found
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create the JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      role : user.role,
    };

    // Sign the JWT token (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    // Respond with the JWT token
    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/test', (req, res) => {
  res.send('Auth Route Working');
});



module.exports = router;
