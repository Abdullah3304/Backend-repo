const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: '' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: false });

const BuyerSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  streetNumber: { type: String, required: true },
  phone: { type: String, required: true },
  buyerGmail: { type: String, required: true },
}, { _id: false });

const CardSchema = new mongoose.Schema({
  name: String,
  cardNumber: String,
  expiry: String,
  cvv: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [ProductSchema],
  buyer: BuyerSchema,
  paymentMethod: String,
  cardDetails: {
    type: CardSchema,
    required: function () { return this.paymentMethod === 'card'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
