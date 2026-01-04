const Order = require('../models/order'); 
const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../Middleware/authMiddleware'); 

router.post('/',authenticateToken, placeOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/seller-orders', authenticateToken, async (req, res) => {
    try {
      console.log('Authenticated seller ID:', req.user.id);
        const orders = await Order.find({
            'products.creator': req.user.id
        });
        console.log('Fetched orders:', orders.length);
        res.json(orders);
    } catch (err) {
        console.error('Error fetching seller orders:', err);
        res.status(500).json({ message: 'Failed to fetch seller orders' });
    }
});
module.exports = router;