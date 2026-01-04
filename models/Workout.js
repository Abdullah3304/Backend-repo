const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: { type: String, required: true },
  type: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number },
  duration: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema); 