const express = require('express');
const multer = require('multer');
const app = express();
const path = require ('path');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
  },
});

const multerUpload = multer({ storage });
// Handle product creation (including image)
router.post('/products', authenticateToken, multerUpload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let image ='';
    if (req.file){
      image=req.file.path;
    }

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      image,  // Store the image path
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

app.use(express.json()); // Parses JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Define your route
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, description, price, category    } = req.body;
  const image = req.file;

  if (!name || !description || !price || !category || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }


  app.post('/api/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, products: [] });
      }
      const productExists = cart.products.find((p) => p.productId.equals(productId));
      if (productExists) {
        productExists.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  

  // Save product logic
  res.status(201).json({ message: 'Product created successfully', data: { name, description, price, category, image } });
});
