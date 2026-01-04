const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { authenticateToken } = require('../Middleware/authMiddleware');

// Protect all workout routes with authentication
router.use(authenticateToken);

router.get('/', workoutController.getAllWorkouts);
router.post('/', workoutController.createWorkout);
router.put('/:id', workoutController.updateWorkout);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router; 