const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartItemSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 }
});


cartSchema.set('strictPopulate', false);  
const Cart = mongoose.model('Cart', cartSchema);


module.exports = mongoose.model('Cart', cartSchema);


