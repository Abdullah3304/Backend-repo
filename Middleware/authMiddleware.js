const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1] || req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided. Authorization denied.' });
  }
  
  try {
    console.log('token', token)
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: 'Invalid token. Authorization denied.' });
  }
};

module.exports = {
  authenticateToken,
};
