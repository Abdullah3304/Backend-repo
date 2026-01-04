const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ Ensure this is added
const { buyMembership } = require('../controllers/membershipController');
const { registerUser, loginUser } = require('../controllers/userController'); // Ensure this is correctly imported
const { authenticateToken } = require('../Middleware/authMiddleware');

router.post('/buy-membership', authenticateToken, buyMembership);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-membership', authenticateToken, async (req, res) => {
  try {
    console.log("Decoded token user:", req.user); // 🔍 Add this

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ isActive: false });
    }

    console.log("User fetched:", user.email);
    console.log("Membership:", user.membership);

    const isActive =
      user.membership?.isActive &&
      new Date(user.membership.expiresAt) > new Date();

    return res.status(200).json({ isActive });
  } catch (err) {
    console.error("Error in check-membership:", err);
    return res.status(500).json({ isActive: false });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('membership');
    res.json({ membership: user.membership });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
