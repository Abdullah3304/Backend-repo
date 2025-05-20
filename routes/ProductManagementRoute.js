const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const isAdmin = require('../Middleware/isAdmin');
const authMiddleware = require('../middleware/auth'); // Assuming authMiddleware exists to authenticate users

// Add a new product
router.post('/products', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const newProduct = new Product({ name, description, price, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

// Delete a product
router.delete('/products/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

// Get all products
router.get('/products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

module.exports = router;
