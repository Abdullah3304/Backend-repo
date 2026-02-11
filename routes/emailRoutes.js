const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/send-receipt
router.post('/send-receipt', authenticateToken, async (req, res) => {
  const { orderDetails } = req.body;
  const email = req.user.email || req.body.email;

  if (!email || !orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
    return res.status(400).json({ message: 'Email and valid order details are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
    });

    const totalPrice = orderDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const mailOptions = {
      from: `"Flex Fuel" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Order Confirmation',
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Here are your order details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p><strong>Total: $${totalPrice}</strong></p>
        <p>We appreciate your business!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;
