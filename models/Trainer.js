// models/Trainer.js
const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  specialization: { type: [String], required: true },
  price: { type: Number, required: true },
  availability: { type: String, required: true }, // online, physical, both
  description: { type: String },
  image: { type: String }, // Link to trainer's image
  gmail: { type: String, required: true },
      onlineClassLink: {
        type: String,
        required: function () { return this.availability === 'online'; }
    },
    gymLocation: {
        type: String,
        required: function () { return this.availability === 'physical'; }
    },
  //creator: {type: String, required: true },
  
  // ✅ NEW FIELD for available slots
  availableSlots: [
    {
      day: { type: String },
      startTime: { type: String },
      endTime: { type: String }
    }
  ]
});

module.exports = mongoose.model('Trainer', TrainerSchema);
