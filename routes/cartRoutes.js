const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const {authenticateToken} = require('../middleware/authMiddleware'); // Import Middleware

// POST /cart - Add product to cart
router.post('/cart', authenticateToken, async (req, res) => {
  console.log('Add to cart endpoint hit:', req.body); 
  console.log(req.user); // Log user info for debugging

  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing' }); // Return error if userId is not found
  }
  console.log('Fetching cart for user:', req.user.id);

  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    let cart = await Cart.findOne({ user: userId }).populate('items.productId'); // Populate productId field

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      console.log('New cart created:', cart); // Log new cart creation

    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity || 1;
    } else {
      const product = await Product.findById(productId);  // Retrieve product to get its price
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      cart.items.push({ productId, quantity: quantity || 1 });
    }

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = item.productId;  // Ensure product is populated
      if (!product || isNaN(product.price)) {
        console.error("Invalid product price or missing product:", product);
        return total;  // Skip if the product is not found or price is invalid
      }
      return total + item.quantity * product.price;
    }, 0);

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error); // Log error for debugging
    res.status(500).json({ error: 'Error adding to cart', details: error.message });
  }
});

// GET /cart - Fetch user's cart items (Added this missing route)
router.get('/cart', authenticateToken, async (req, res) => {
  console.log('Authorization header:', req.headers['authorization']);
  console.log('User from token:', req.user);  // Log user information to verify token decoding

  try {
    const userId = req.user.id; // Get user ID from the token
    console.log('Fetching cart for user:', userId); // Log the userId to ensure it's correctly extracted

    const cart = await Cart.findOne({ user: userId }).populate('items.productId'); // Populate productId field

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // If cart exists but no items, return an empty array
    if (cart.items.length === 0) {
      return res.status(200).json({ message: 'Cart is empty', cartItems: [], totalPrice: 0 });
    }

    // Log the populated items to check if they are valid
    console.log('Cart items populated:', cart.items);

    res.status(200).json({ cartItems: cart.items, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error('Error fetching cart:', error); // Log error for debugging
    res.status(500).json({ message: 'Unable to fetch cart data', error: error.message });
  }
});


// PUT /cart/:itemId - Update item quantity
router.put('/cart/:itemId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be greater than 0' });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity; // Update quantity

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = item.productId;
      return total + (product ? item.quantity * product.price : 0);
    }, 0);

    await cart.save();
    res.status(200).json({ cartItems: cart.items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// DELETE /cart/:itemId - Remove product from cart
router.delete('/cart/:itemId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1); // Remove item from cart

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = item.productId;
      return total + (product ? item.quantity * product.price : 0);
    }, 0);

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cartItems: cart.items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

module.exports = router;
