const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const checkMembership = require('../middleware/checkMembership');
const Trainer = require('../models/Trainer');
const { hireTrainer } = require('../controllers/hireTrainerController');
const { authenticateToken } = require('../middleware/authMiddleware');

exports.hireTrainer = async (req, res) => {
  console.log('✅ hireTrainer route hit');
};
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


router.post('/hire', hireTrainer);

// POST route to handle trainer registration
router.post('/register',authenticateToken, checkMembership, upload.single('image'), async (req, res) => {
  const {
    name,
    gender,
    specialization,
    price,
    availability,
    description,
    gmail, 
    onlineClassLink,
    gymLocation,
    availableSlots,
  } = req.body;
  const image = req.file ? req.file.path : null;

  // Validation based on availability
  if (availability === 'online' && !onlineClassLink) {
    return res.status(400).json({ message: 'Online class link is required for online availability' });
  }
  if (availability === 'physical' && !gymLocation) {
    return res.status(400).json({ message: 'Gym location is required for physical availability' });
  }

  try {
    let parsedSlots = [];
    if (availableSlots) {
      try {
        parsedSlots = JSON.parse(availableSlots);
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
      gmail, 
      onlineClassLink,
      gymLocation,
      availableSlots: parsedSlots, // Save slots array
      image,
      creator: req.user.id
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
    let trainers = await Trainer.find({ gender: 'male', });
    console.log('trainers', req.user.id, trainers);
    
    const trainersWithCreatorFlag = trainers.map(trainer => {
      const trainerObj = trainer.toObject();
      trainerObj.isCreator = trainer.creator && trainer.creator.toString() === req.user.id.toString();
      
      return trainerObj;
    });
    
    res.status(200).json(trainersWithCreatorFlag);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching male trainers', error });
  }
});

// Route to fetch female trainers
router.get('/female', async (req, res) => {
  try {
    let trainers = await Trainer.find({ gender: 'female', });
    console.log('trainers', req.user.id, trainers);
    
    const trainersWithCreatorFlag = trainers.map(trainer => {
      const trainerObj = trainer.toObject();
      trainerObj.isCreator = trainer.creator && trainer.creator.toString() === req.user.id.toString();
      
      return trainerObj;
    });
    
    res.status(200).json(trainersWithCreatorFlag);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching female trainers', error });
  }
});

router.get('/my-trainer', authenticateToken, async (req, res) => {
  console.log('Decoded JWT user:', req.user);
  const loggedInEmail = req.user.email;

  try {
    const trainer = await Trainer.findOne({ gmail: loggedInEmail });
    if (!trainer) return res.status(404).json({ message: 'No trainer profile found' });

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Update trainer info
router.put('/update-trainer/:id', authenticateToken,
  upload.single('image'),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.image = req.file.path;
      }

      if (updateData.specialization) {
        try {
          const parsedSpec = JSON.parse(updateData.specialization);
          
          if (Array.isArray(parsedSpec)) {
            updateData.specialization = parsedSpec.join(', ');
          } else {
            updateData.specialization = parsedSpec;
          }
        } catch {
          if (updateData.specialization.includes(',')) {
            const specArray = updateData.specialization.split(',').map(s => s.trim());
            updateData.specialization = specArray.join(', ');
          }
        }
      }

      //  Validation based on updated availability
      if (updateData.availability === 'online') {
        if (!updateData.onlineClassLink) {
          return res.status(400).json({ message: 'Online class link is required for online availability' });
        }
        updateData.gymLocation = undefined;
      }

      if (updateData.availability === 'physical') {
        if (!updateData.onlineClassLink) {
          return res.status(400).json({ message: 'Gym location is required for physical availability' });
        }
        updateData.gymLocation = undefined;
      }

      if (updateData.availableSlots) {
        try {
          updateData.availableSlots = JSON.parse(updateData.availableSlots);
        } catch {
          updateData.availableSlots = []; 
        }
      }

      const updatedTrainer = await Trainer.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedTrainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }

      res.status(200).json(updatedTrainer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating trainer', error });
    }
  }
);


// Delete trainer profile
router.delete('/delete-trainer/:id', async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainer', error });
  }
});
// Get a specific trainer by ID
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainer by ID', error });
  }
});


module.exports = router;
