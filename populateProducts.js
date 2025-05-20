const mongoose = require('mongoose');
const Product = require('./models/product'); // This is correct, assuming 'product.js' is in 'models' folder
const connectDB = require('./config/db'); // This is correct if 'db.js' is in the root folder

// Sample product data
const products = [
  { name: 'Product 1', price: 29.99, description: 'Description 1', category: 'Category 1' },
  { name: 'Product 2', price: 39.99, description: 'Description 2', category: 'Category 2' },
  { name: 'Product 3', price: 49.99, description: 'Description 3', category: 'Category 3' },
];

// Function to add products to the database
const addProducts = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Insert products into the database
    await Product.insertMany(products);
    console.log('Products added successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding products:', error);
  }
};

// Run the addProducts function
addProducts();
