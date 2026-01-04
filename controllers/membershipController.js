const User = require('../models/User');

exports.buyMembership = async (req, res) => {
  const userId = req.user.id;

  const now = new Date();
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + 1); 

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        membership: {
          isActive: true,
          boughtAt: now,
          expiresAt: expires
        }
      },
      { new: true }
    );

    res.status(200).json({ message: 'Membership purchased successfully', membership: user.membership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update membership', details: error });
  }
};
