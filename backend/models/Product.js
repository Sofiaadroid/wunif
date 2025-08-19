const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ isActive: 1, size: 1, model: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
