const Trainer = require('../models/Trainer');
const sendEmail = require('../utils/sendEmail');
const Hire = require('../models/Hire'); // Adjust path if your Hire.js is in a different folder

exports.hireTrainer = async (req, res) => {
  const { trainerId, gmail, paymentOption } = req.body;

  if (!trainerId || !gmail || !paymentOption) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    // ✅ Step 3 - Save to DB
    const newHire = new Hire({
      trainerId,
      gmail,
      paymentOption,
    });
    await newHire.save();

    const receiptHtml = `
      <h2>Trainer Booking Confirmation</h2>
      <p><strong>Trainer:</strong> ${trainer.name}</p>
      <p><strong>Specialization:</strong> ${trainer.specialization.join(', ')}</p>
      <p><strong>Price:</strong> Rs. ${trainer.price}</p>
      <p><strong>Payment Method:</strong> ${paymentOption === 'cash' ? 'Cash at Gym' : 'Card/Debit (Simulated)'}</p>
      <p><strong>Availability:</strong> ${trainer.availability}</p>
      <p><strong>Trainer Gmail:</strong> ${trainer.gmail}</p>
      ${trainer.availability === 'online'
        ? `<p><strong>Class Link:</strong> <a href="${trainer.onlineClassLink}">${trainer.onlineClassLink}</a></p>`
        : `<p><strong>Gym Location:</strong> ${trainer.gymLocation}</p>`
      }
      <p>Thank you for booking with FitnessHub!</p>
    `;

    await sendEmail(gmail, 'Your Trainer Booking Confirmation', receiptHtml, true);
    await sendEmail(trainer.gmail, 'You Have a New Booking', `
      You’ve been hired by ${gmail}.
      Please reach out and prepare for your upcoming session.
    `, false);

    res.status(200).json({ message: 'Hire saved and Emails sent successfully' });
  } catch (error) {
    console.error('Hire Error:', error);
    res.status(500).json({ message: 'Failed to process trainer hire', error });
  }
};
