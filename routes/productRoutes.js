const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const productController = require('../controllers/ProductControllers');
const { authenticateToken } = require('../Middleware/authMiddleware');  // Import the JWT authentication middleware

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');  // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  },
});

const multerUpload = multer({ storage });

// Route to add product
router.post('/products', authenticateToken, multerUpload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;  // Extract the product details from the request body
    const image = req.file ? req.file.path : null;
    

    // Validate required fields (name, description, and price)
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,  // Image path will be empty if no image is provided
    });

    await newProduct.save();  // Save the product to the database

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error(error);  // Log any errors
    res.status(500).json({ message: 'Error adding product', error: error.message });  // Send error details
  }
});
// Get all products route
router.get('/products', productController.getProducts);  

// Get a single product by ID
router.get('/products/:id', productController.getProductById);

// Update an existing product route (requires authentication)
router.put('/products/:id', authenticateToken, multerUpload.single('image'), productController.updateProduct);

// Delete a product route (requires authentication)
// router.delete('/products/:id', authenticateToken, productController.deleteProduct);

module.exports = router;
