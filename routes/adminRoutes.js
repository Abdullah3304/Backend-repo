const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { authenticateToken } = require('../Middleware/authMiddleware');
const isAdmin = require('../Middleware/isAdmin');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ✅ Folder must exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ POST route to handle product creation with image
router.post('/products', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? req.file.path : null; // ✅ Use path like in trainer backend

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// ✅ PUT route to update product with image
router.put('/products/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body;
  const updateData = { name, price, description };

  if (req.file) {
    updateData.image = req.file.path; // ✅ Use full path
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// GET all products
router.get('/products', authenticateToken, isAdmin, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// DELETE product
router.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
