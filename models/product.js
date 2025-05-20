const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String, default:'' },
  ownerId: { type: String, required: true }
}
  
);
const Product = mongoose.model('Product', productSchema);


module.exports = mongoose.model('Product', productSchema);
