const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Merge compatibility for both systems
    req.user = {
      ...decoded,
      _id: decoded.id || decoded._id,   // Support _id for MongoDB logic
      id: decoded.id || decoded._id,    // Support id for consistency
      role: decoded.role || 'user',     // Default role
      isAdmin: decoded.isAdmin || false // Support admin checks
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: 'Invalid token. Authorization denied.' });
  }
};

module.exports = {
  authenticateToken,
};
