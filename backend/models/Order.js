const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  model: String,
  size: String,
  unitPrice: Number,
  quantity: { type: Number, min: 1, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['PSE', 'DEBITO', 'CREDITO'], required: true },
  status: { type: String, enum: ['PAID', 'FAILED', 'PENDING'], default: 'PAID' },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
