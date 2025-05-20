const Cart = require('../models/cart'); 
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log('Fetching cart for user:', userId); 
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    console.log('Fetching cart for user:', userId); 

    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    console.error('error fetching>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<' );
    res.status(500).json({ message: 'Unable to fetch cart data' });
  }
};

module.exports = {
  getCartItems,
};
