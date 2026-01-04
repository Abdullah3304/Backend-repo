const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String, default:'' }
  
},
  {timestamps:true}
);


module.exports = mongoose.model('Product', productSchema);
