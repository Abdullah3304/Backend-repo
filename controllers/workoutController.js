const Workout = require('../models/Workout');

// Get all workouts for the authenticated user
exports.getAllWorkouts = async (req, res) => {
  try {
    console.log('User from request:', req.user);
    console.log('User ID being used:', req.user._id);
    const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log('Found workouts:', workouts);
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error in getAllWorkouts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new workout for the authenticated user
exports.createWorkout = async (req, res) => {
  console.log('Creating workout for user:', req.user._id);
  const workout = new Workout({
    ...req.body,
    user: req.user._id
  });
  try {
    const newWorkout = await workout.save();
    console.log('Created workout:', newWorkout);
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error in createWorkout:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a workout (only if it belongs to the authenticated user)
exports.updateWorkout = async (req, res) => {
  try {
    console.log('Updating workout for user:', req.user._id);
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    Object.assign(workout, req.body);
    const updatedWorkout = await workout.save();
    console.log('Updated workout:', updatedWorkout);
    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error('Error in updateWorkout:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a workout (only if it belongs to the authenticated user)
exports.deleteWorkout = async (req, res) => {
  try {
    console.log('Deleting workout for user:', req.user._id);
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    await workout.deleteOne();
    console.log('Deleted workout successfully');
    res.status(200).json({ message: 'Workout deleted' });
  } catch (error) {
    console.error('Error in deleteWorkout:', error);
    res.status(500).json({ message: error.message });
  }
}; 