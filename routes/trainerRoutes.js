const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Trainer = require('../models/Trainer');
const { authenticateToken } = require('../Middleware/authMiddleware');
const verifyTrainerOwner = require('../Middleware/verifyTrainerOwner');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST route to handle trainer registration
router.post('/register', upload.single('image'), async (req, res) => {
  const {
    name,
    gender,
    specialization,
    price,
    availability,
    description,
    gmail, // ✅ Extract gmail
    availableSlots,
    token
  } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    let parsedSlots = [];
    if (availableSlots) {
      try {
        parsedSlots = JSON.parse(availableSlots); // ✅ Parse JSON string from frontend
      } catch (err) {
        return res.status(400).json({ message: 'Invalid format for availableSlots', error: err });
      }
    }

    const newTrainer = new Trainer({
      name,
      gender,
      specialization,
      price,
      availability,
      description,
      gmail, // ✅ Save gmail
      availableSlots: parsedSlots, // ✅ Save slots array
      image
    });

    await newTrainer.save();

    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(400).json({ message: 'Error registering trainer', error });
  }
});

// Route to fetch male trainers
router.get('/male', async (req, res) => {
  try {
    const trainers = await Trainer.find({ gender: 'male' });
    res.status(200).json(trainers);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching male trainers', error });
  }
});

// Route to fetch female trainers
router.get('/female', async (req, res) => {
  try {
    const trainers = await Trainer.find({ gender: 'female' });
    res.status(200).json(trainers);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching female trainers', error });
  }
});

router.get('/my-trainer', authenticateToken, async (req, res) => {
  onsole.log('Decoded JWT user:', req.user);
  const loggedInEmail = req.user.email;

  try {
    const trainer = await Trainer.findOne({ gmail: loggedInEmail });
    if (!trainer) return res.status(404).json({ message: 'No trainer profile found' });

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// ✅ Update trainer info
router.put(
  '/update-trainer/:id',
  authenticateToken,
  verifyTrainerOwner,
  upload.single('image'), // ✅ support file uploads
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      // ✅ Handle image upload
      if (req.file) {
        updateData.image = req.file.path;
      }

      // ✅ Handle JSON strings
      if (updateData.specialization) {
        try {
          updateData.specialization = JSON.parse(updateData.specialization);
        } catch {
          // fallback in case it's a plain string, not JSON
          updateData.specialization = updateData.specialization.split(',').map(s => s.trim());
        }
      }

      if (updateData.availableSlots) {
        try {
          updateData.availableSlots = JSON.parse(updateData.availableSlots);
        } catch {
          updateData.availableSlots = []; // fallback
        }
      }

      const updatedTrainer = await Trainer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.status(200).json(updatedTrainer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating trainer', error });
    }
  }
);


// ✅ Delete trainer profile
router.delete('/delete-trainer/:id', authenticateToken, verifyTrainerOwner, async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainer', error });
  }
});

module.exports = router;
