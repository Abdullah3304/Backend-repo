// models/FitnessProducts.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'Fitness Equipment',
      'Fitness Apparel',
      'Supplements & Nutrition',
      'Gym Accessories',
      'Tech & Wearables',
      'Fitness Resources',
      'Health & Hygiene'
    ],
    required: true
  },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  creator: { type: String, required: true },
  gmail: { type: String, required: true }
});

module.exports = mongoose.model('FitnessProducts', ProductSchema);
