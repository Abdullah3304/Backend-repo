const mongoose = require('mongoose');

const hireSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  gmail: String,
  paymentOption: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Hire', hireSchema);