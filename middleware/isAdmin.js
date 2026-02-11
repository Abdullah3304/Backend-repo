
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized. Token missing or invalid.' });
    }

    const userId = req.user.id; 
    const user = await User.findById(userId); 

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied. Admins only.' });
    }

    next(); 
  } catch (error) {
    console.error('Error in isAdmin Middleware:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = isAdmin;
