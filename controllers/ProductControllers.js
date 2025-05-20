const Product = require('../models/product');
const fs = require('fs').promises; 

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
    console.log('Received body:', req.body);
  console.log('Received file:', req.file); 

  try {
    const { name, price, description, category } = req.body;
    let imagePath='';
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
    }

    if (!name || !price || !description || !category) {
      return res.status(400).json({
        error: 'All fields (name, price, description, category) are required.',
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image:imagePath,
    });
    await newProduct.save();


  
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const productId = req.params.id;

    let updatedProduct = await Product.findById(productId);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.file) {
      if (updatedProduct.image) {
        await fs.unlink(updatedProduct.image);
      }
      updatedProduct.image = req.file.path; 
    }

    updatedProduct.name = name || updatedProduct.name;
    updatedProduct.price = price || updatedProduct.price;
    updatedProduct.description = description || updatedProduct.description;
    updatedProduct.category = category || updatedProduct.category;
    updatedProduct.stock = stock || updatedProduct.stock;

    updatedProduct = await updatedProduct.save();
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message, req: req.file.path });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (deletedProduct.image) {
      await fs.unlink(deletedProduct.image);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};
