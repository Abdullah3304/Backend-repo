const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const checkMembership = require('../Middleware/checkMembership');
const FitnessProduct = require('../models/FitnessProducts'); // ✅ model is FitnessProduct
const { authenticateToken } = require('../Middleware/authMiddleware');

// Multer config for uploading images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Register a new fitness product
router.post('/register', authenticateToken, checkMembership, upload.single('image'), async (req, res) => {
  const { name, type, description, price, gmail } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const newFitnessProduct = new FitnessProduct({
      name,
      type,
      description,
      price,
      image,
      gmail,
      creator: req.user.id
    });

    await newFitnessProduct.save();
    res.status(201).json(newFitnessProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error registering product', error });
  }
});

// Get all products by type
router.get('/type/:type', async (req, res) => {
  try {
    const products = await FitnessProduct.find({ type: req.params.type });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by type', error });
  }
});

// Get logged-in user's products by Gmail
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    const products = await FitnessProduct.find({ gmail: req.user.email });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your products', error });
  }
});

// Update fitness product
router.put('/update/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await FitnessProduct.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Fitness product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete fitness product
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    await FitnessProduct.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Fitness product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Get a specific fitness product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await FitnessProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Fitness product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product by ID', error });
  }
});

// Get all fitness products
router.get('/', async (req, res) => {
  try {
    const products = await FitnessProduct.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all fitness products', error });
  }
});

module.exports = router;
