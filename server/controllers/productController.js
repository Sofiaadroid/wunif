const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
  try {
    const product = await Product.create({ name, description, price, image });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
