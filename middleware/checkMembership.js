const User = require('../models/User');

const checkMembership = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.membership?.isActive) {
      return res.status(403).json({ error: 'You must be a member to perform this action' });
    }

    // Optional: Check expiration
    if (new Date(user.membership.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Membership has expired. Please renew.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Membership check failed', details: err });
  }
};

module.exports = checkMembership;
