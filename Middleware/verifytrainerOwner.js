const Trainer = require('../models/Trainer');

// Make sure the trainer belongs to the logged-in user
const verifyTrainerOwner = async (req, res, next) => {
  const trainerId = req.params.id;
  const loggedInEmail = req.user.email; // From JWT

  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (trainer.gmail !== loggedInEmail) {
      return res.status(403).json({ message: 'Access denied: Not your profile' });
    }

    next(); // ✅ All good
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = verifyTrainerOwner;
