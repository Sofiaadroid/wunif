const Order = require('../models/Order');
const { validationResult } = require('express-validator');

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { products, payment } = req.body;
  if (!products || !products.length) return res.status(400).json({ error: 'Carrito vacío' });
  try {
    const order = await Order.create({ userId: req.user?.id || null, products, payment });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};
