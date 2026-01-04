const Order = require('../models/order');

const placeOrder = async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            userId: req.user.id // Add the user ID from token
        });
        await order.save();

        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error placing order' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
};

module.exports = { placeOrder, getUserOrders };
