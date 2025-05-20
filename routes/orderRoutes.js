const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // adjust path if needed
const { authenticateToken } = require('../Middleware/authMiddleware');

// POST route to save order
router.post('/', async (req, res) => {
  const orderData = req.body;
  try {
    const order = new Order(orderData);
    await order.save();
    console.log('Order Received:', order);
    res.status(200).json({ message: 'Order saved successfully', order });
  } catch (err) {
    res.status(500).json({ error: 'Order saving failed' });
  }
});

// GET orders by user ID via query param
router.get('/',authenticateToken, async (req, res) => {
  try {
    const userId = req.user.Id;  // Better: use auth middleware and req.user.id
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// DELETE order by id
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});
// NEW: Cleanup route to delete orders older than 30 days
router.delete('/cleanup/old', async (req, res) => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const result = await Order.deleteMany({ createdAt: { $lt: cutoff } });
    res.json({ message: `${result.deletedCount} old orders deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clean up old orders' });
  }
});

module.exports = router;
