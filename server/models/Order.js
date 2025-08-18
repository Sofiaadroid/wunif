const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  products: [{ productId: String, quantity: Number }],
  payment: {
    name: String,
    card: String,
    exp: String,
    cvv: String,
    email: String
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
